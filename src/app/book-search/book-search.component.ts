import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Book } from '../book';
import { BookService } from '../service/book.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent implements OnInit {

  // books亜種としてobservable型の物を渡している
  books$!: Observable<Book[]>;
  // searchTermsをSubject（Observableの上位互換）でインスタンス化している
  private searchTerms = new Subject<string>();


  constructor(private bookService: BookService, private router: Router) { }

  // 検索語をobservableストリームにpushする→Subjectを使用しているので、nextメソッドで検索語を常に更新し続けることができる
  search(term: string): void {
    this.searchTerms.next(term);
  }

  // ユーザーがキーボードを動かすたびに同期的にbookServiceのsearchBooksを呼び出していては、サーバーリソースを圧迫してしまう
  // →いくつかのRxjsオペレータをつなげることで、条件をクリアした時のみbookServiceにアクセスするようにしている
  ngOnInit(): void {
    this.books$ = this.searchTerms.pipe(
      // inputの中身が変化した後、検索前に200ms待つ
      debounceTime(200),
      // 直前の検索語と同じ場合は無視する
      distinctUntilChanged(),
      // 検索語が変化する度に、新しい検索observableにスイッチする
      switchMap((term: string) => this.bookService.searchBooks(term))
    );
  }

  goToBooks(): void {
    this.router.navigate(['/books']);
  }


}
