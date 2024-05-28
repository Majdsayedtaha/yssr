import { Directive, HostListener, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[infiniteScroll]',
})
export class InfiniteScrollDirective {
  @Output() scrollPosition = new EventEmitter<number>();

  constructor(private el: ElementRef) {}

  @HostListener('scroll', ['$event'])
  onScroll() {
    const nativeElement = this.el.nativeElement;
    const scrollPercentage =
      (nativeElement.scrollTop / (nativeElement.scrollHeight - nativeElement.clientHeight)) * 100;
    if (scrollPercentage > 98) this.scrollPosition.emit(scrollPercentage);
  }
}
