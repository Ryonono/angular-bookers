import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../book';
import { BookService } from '../service/book.service';
// core.mjs:7640 ERROR Error: Uncaught (in promise): NullInjectorError: R3InjectorError(AppModule)[Location -> Location -> Location]: 
//   NullInjectorError: No provider for Location!
// NullInjectorError: R3InjectorError(AppModule)[Location -> Location -> Location]:というエラーがでて、detailページに飛ぶことができなかったが、
// コンポーネント生成時にLocationがまずimportされておらず、読み込めていなかったことが原因だった。 
import { Location } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute, private bookService: BookService, private location: Location, private router: Router) { }

  @Input() book?: Book;

  ngOnInit(): void {
    this.getBook();
  }

  getBook(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')!);
    this.bookService.getBook(id).subscribe(book => this.book = book);
  }

  delete(book: Book): void {
    this.bookService.deleteBook(book.id).subscribe();
  }

  goToBooks(): void {
    this.router.navigate(['/books']);
  }


}
