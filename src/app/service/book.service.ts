import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Book } from '../book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private bookUrl = "/api/books";

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.bookUrl)
      .pipe(
        tap(book => console.log('fetched books')),
        catchError(this.handleError<Book[]>('getBooks', []))
      );
  }

  getBook(id: number): Observable<Book> {
    const url = `${this.bookUrl}/ ${id}`;
    return this.http.get<Book>(url)
      .pipe(
        tap(= => console.log(`fetched book id = ${id}`)),
        catchError(this.handleError<Book>(`getBook id ='${id}`))
      )
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.bookUrl, book)
      .pipe(
        tap((bookForm: Book) => console.log(`added book id = ${book.id}`)),
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

  @param operation
  @param result

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
