import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DirectionService {
  private directionSubject = new BehaviorSubject<'ltr' | 'rtl'>('ltr');
  direction$ = this.directionSubject.asObservable();

  constructor() {}

  setDirection(direction: 'ltr' | 'rtl') {
    this.directionSubject.next(direction);
  }

  getDirection() {
    return this.directionSubject.value;
  }
}
