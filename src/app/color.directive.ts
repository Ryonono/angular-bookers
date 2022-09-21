import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[myColored]'
})

export class ColoredDirective {
  // ここでcolor = "red";としているが、基本的に呼び出し元のコンポーネントで設定したcolorの値が優先的に読み込まれるので、この設定は意味を持っていない
  @Input('myColored') color = "red";

  constructor(private el: ElementRef) { }

  // これらのイベントバインダーはapp.module.tsファイルにインポートされた地点で、[myColored]というセレクターがある場所には自動的に読み込まれるので、特に呼び出し元のコンポーネントで定義する必要はない
  @HostListener('mouseenter') onmouseenter() {
    console.log("mouseenter done");
    this.el.nativeElement.style.backgroundColor = this.color;
  }

  @HostListener('mouseleave') onmouseleave() {
    console.log("mouseleave done");
    this.el.nativeElement.style.backgroundColor = '';
  }
}