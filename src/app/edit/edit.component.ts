import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../book';
import { BooksComponent } from '../books/books.component';
import { BookService } from '../service/book.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  books: Book[] = [];

  @Input() book?: Book;

  bookEditForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2), BooksComponent.notOnlyWhiteSpace]),
    comment: new FormControl('', [Validators.required, Validators.minLength(2), BooksComponent.notOnlyWhiteSpace])
  })

  constructor(private route: ActivatedRoute, private bookService: BookService, private location: Location, private router: Router) { }

  ngOnInit(): void {
    this.getBook();
  }

  getBook(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')!);
    this.bookService.getBook(id).subscribe(book => this.book = book);
  }

  update(title: string, comment: string): void {
    title = title.trim();
    comment = comment.trim();
    if (!title || !comment) { return; }
    if (this.book) {
      this.bookService.updateBook(this.book)
        .subscribe(() => this.goToBooks());
    }
  }

  delete(book: Book): void {
    this.bookService.deleteBook(book.id).subscribe();
  }

  goToBooks(): void {
    this.router.navigate(['/books']);
  }

  get title() { return this.bookEditForm.get('title')!; }
  get comment() { return this.bookEditForm.get('comment')!; }

}
