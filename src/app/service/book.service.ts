import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError, throwIfEmpty } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Book } from '../book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private bookUrl = "/api/books";

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    // httpClientを使用し、その中のgetメソッドを呼び出す（<Book[]>で取り出す対象を定義し、this.bookUrlでどこからとってくるかを指定する
    return this.http.get<Book[]>(this.bookUrl)
      .pipe(
        tap(book => console.log('fetched books')),
        catchError(this.handleError<Book[]>('getBooks', []))
      );
  }

  getBook(id: number): Observable<Book> {
    const url = `${this.bookUrl}/${id}`;
    return this.http.get<Book>(url)
      .pipe(
        tap(_ => console.log(`fetched book id = ${id}`)),
        catchError(this.handleError<Book>(`getBook id ='${id}`))
      )
  }

  addBook(book: Book): Observable<Book> {
    // postメソッドの第一引数はURL,第二引数が加えるデータ、第三引数（オプション）にはヘッダ情報を渡す
    return this.http.post<Book>(this.bookUrl, book, this.httpOptions)
      .pipe(
        // 初め、console.logは${book.id}を呼び出していたが、tapメソッドでbookFormをBook型のものとして作成しているので、
        // ここはbookForm.idとする必要があった→正味tapメソッドの初めの引数はなんでも良いので、bookに変更
        tap((book: Book) => console.log(`added book id = ${book.id}`)),
        catchError(this.handleError<Book>('addBook'))
      );
  }

  updateBook(book: Book): Observable<any> {
    return this.http.put(this.bookUrl, book, this.httpOptions)
      .pipe(
        tap(_ => console.log(`updated Book id = ${book.id}`)),
        catchError(this.handleError<Book>('updatebook'))
      );
  }

  deleteBook(id: number): Observable<Book> {
    const url = `${this.bookUrl}/${id}`;
    return this.http.delete<Book>(url, this.httpOptions)
      .pipe(
        tap(_ => console.log(`deleted Book id = ${id}`)),
        catchError(this.handleError<Book>('deleteBook'))
      );
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // @param operation
  // @param result

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }


  // searchBooksの際、trimした後のデータの長さが0であれば、一覧画面を表示できるように設定はできた（goToBooks()のような感じで、別で定義したメソッドをthis.メソッドという形で呼び出せば良いことがわかった）
  // →　＋αで、templateの部分でngIfを用いて条件分岐をしたら、初期状態なら
  searchBooks(term: string): Observable<Book[]> {
    if (term.trim().length == 0) {
      return this.getBooks();
    }
    // ?name=${term}この部分だけで勝手に検索結果を絞って表示してくれるのか、？
    // trimメソッドを用いることで、検索結果にも前後の空白は含まないように設定できた
    return this.http.get<Book[]>(`${this.bookUrl}/?title=${term.trim()}`).pipe(
      tap(_ => console.log(`found books matching title = "${term.trim()}"`)),
      catchError(this.handleError<Book[]>('searchBooks', []))
    );
  }

}
