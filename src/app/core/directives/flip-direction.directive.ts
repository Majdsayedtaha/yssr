import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { DirectionService } from '../services/direction.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[flipDirection]',
})
export class FlipDirectionDirective implements OnInit, OnDestroy {
  dirSub$!: Subscription;
  constructor(private el: ElementRef, private dir: DirectionService) { }

  ngOnInit(): void {
    this.dirSub$ = this.dir.direction$.subscribe((dir) =>
      this.flipDirection(dir)
    );
  }

  flipDirection(direction: 'ltr' | 'rtl') {
    if (direction === 'rtl') {
      this.el.nativeElement.classList.remove('text-left');
      this.el.nativeElement.classList.add('text-right');
    } else if (direction === 'ltr') {
      this.el.nativeElement.classList.remove('text-right');
      this.el.nativeElement.classList.add('text-left');
    }
  }

  ngOnDestroy(): void {
    this.dirSub$.unsubscribe();
  }
}
