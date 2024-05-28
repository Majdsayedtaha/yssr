import { FormGroup } from '@angular/forms';
import { Component, OnInit, inject } from '@angular/core';
import { debounceTime, switchMap, catchError, of, Subscription } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DatePipe } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'ag-filter-renderer',
  template: ``,
  styles: [``],
})
export class FilterTemplate implements OnInit {
  private _datePipe = inject(DatePipe);
  private formChangesSub$!: Subscription;
  private formValue?: any;
  protected form!: FormGroup;
  protected core: any;
  protected params!: any;
  protected field: string = '';

  init(params: any) {
    this.params = params;
    this.core = params?.context?.parentComp;
    this.field = params.colDef?.field || '';
  }

  isFilterActive(): boolean {
    return this.form?.valid;
  }

  ngOnInit(): void {
    if (this.form?.value) this.formValue = { ...this.form?.value };
    this.watchClearFilter();
    this.watchFormChanges();
  }

  watchClearFilter() {
    this.params?.context?.parentComp?.filterService?.clearFilter?.pipe(untilDestroyed(this)).subscribe((v: boolean) => {
      if (v) this.form?.setValue(this.formValue, { emitEvent: false });
    });
  }

  watchFormChanges() {
    if (this.formChangesSub$) return;
    this.formChangesSub$ = this.form?.valueChanges
      ?.pipe(
        untilDestroyed(this),
        debounceTime(500),
        switchMap(res => {
          if (this.form.valid) {
            if (res?.from === '' || res?.from === null || res?.to === '' || res?.to === null)
              delete this.core.filterObj[this.field];
            else if (res.from && res.to && typeof res.from !== 'number' && typeof res.to !== 'number') {
              this.core.filterObj[this.field] = {
                from: this._datePipe.transform(res.from, 'YYYY/MM/dd'),
                to: this._datePipe.transform(res.to, 'YYYY/MM/dd'),
              };
            } else this.core.filterObj[this.field] = Object.keys(res).length === 1 ? res[this.field] : res;
            return this.core.getList()?.pipe(catchError(() => of([])));
          }
          return of([]);
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }

  protected handleChanges(value: any) {}
}
