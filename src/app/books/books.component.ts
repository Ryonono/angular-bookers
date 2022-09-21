import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from '../book';
import { BookService } from '../service/book.service';
import { Location } from '@angular/common'
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  books: Book[] = [];

  books$!: Observable<Book[]>;

  private searchTerms = new Subject<string>();

  static notOnlyWhiteSpace(control: FormControl): ValidationErrors | null {
    if ((control.value != null) && (control.value.trim().length === 0)) {
      console.log('notOnlyWhiteSpace Error');
      return { 'notOnlyWhiteSpace': true };
    }
    return null;
  }


  bookForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2), BooksComponent.notOnlyWhiteSpace]),
    comment: new FormControl('', [Validators.required, Validators.minLength(2), BooksComponent.notOnlyWhiteSpace])
  })

  constructor(private bookService: BookService, private location: Location, private router: Router) { }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  // ユーザーがキーボードを動かすたびに同期的にbookServiceのsearchBooksを呼び出していては、サーバーリソースを圧迫してしまう
  // →いくつかのRxjsオペレータをつなげることで、条件をクリアした時のみbookServiceにアクセスするようにしている
  ngOnInit(): void {
    // this.getBooks();
    this.books$ = this.searchTerms.pipe(
      // inputの中身が変化した後、検索前に100ms待つ
      debounceTime(100),
      // 直前の検索語と同じ場合は無視する
      distinctUntilChanged(),
      // 検索語が変化する度に、新しい検索observableにスイッチする
      switchMap((term: string) => this.bookService.searchBooks(term))
    );
    // if ((term: string) => this.bookService.searchBooks(term) === null) {
    //   this.getBooks();
    // }
  }


  getBooks(): void {
    this.bookService.getBooks().subscribe(books => this.books = books);
  }

  add(title: string, comment: string): void {
    title = title.trim();
    comment = comment.trim();
    if (!title || !comment) { return; }
    this.bookService.addBook({ title, comment } as Book)
      .subscribe(book => {
        this.books.push(book);
      });
  }

  delete(book: Book): void {
    this.bookService.deleteBook(book.id).subscribe();
  }

  get title() { return this.bookForm.get('title')!; }
  get comment() { return this.bookForm.get('comment')!; }


  goToBooks() {
    this.ngOnInit();
  }



}
