import { Component, OnInit, OnDestroy, EventEmitter, Inject, INJECTOR, Injector, Input, Output } from '@angular/core';
import { debounceTime } from 'rxjs';
import { CoreBaseComponent } from '../base/base.component';
@Component({
  selector: 'app-lookup-search',
  templateUrl: './lookup-search.component.html',
  styleUrls: ['./lookup-search.component.scss'],
})
export class LookupSearchComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @Output() changes = new EventEmitter<string>();
  @Input() title: string = '';
  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.subjectSub = this.subject?.pipe(debounceTime(500)).subscribe((res: any) => {
      this.changes.next(res.target.value);
    });
  }

  getDeepWithFilter(event: any) {
    this.subject.next(event);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.subjectSub?.unsubscribe();
  }
}
