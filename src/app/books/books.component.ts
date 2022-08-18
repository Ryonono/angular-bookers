import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from '../book';
import { BookService } from '../service/book.service';
import { Location } from '@angular/common'

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  books: Book[] = [];

  static notOnlyWhiteSpace(control: FormControl): ValidationErrors | null {
    if ((control.value != null) && (control.value.trim().length == 0)) {
      return { 'notOnlyWhiteSpace': true };
    }
    return null;
  }


  bookForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2), BooksComponent.notOnlyWhiteSpace]),
    comment: new FormControl('', [Validators.required, Validators.minLength(2), BooksComponent.notOnlyWhiteSpace])
  })

  constructor(private bookService: BookService, private location: Location, private router: Router) { }

  ngOnInit(): void {
    this.getBooks();
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
