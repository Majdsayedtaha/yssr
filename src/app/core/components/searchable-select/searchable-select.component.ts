import {
  ChangeDetectorRef,
  Component,
  INJECTOR,
  Inject,
  Injector,
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IResponse } from '../../models';
import { Observable, map, of, switchMap, Subscription, debounceTime } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from '../base/base.component';
import { MatSelect } from '@angular/material/select';
import { finalize, catchError } from 'rxjs';
import { IEnum } from '../../interfaces';
@UntilDestroy()
@Component({
  selector: 'mat-searchable-select',
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss'],
})
export class SearchableSelectComponent extends CoreBaseComponent implements OnInit, OnDestroy, OnChanges {
  myControl = new FormControl('');
  filterLength = 0;
  @ViewChild('searchInput') searchInput: any;
  filteredOptions?: Observable<any[]>;
  selectedOption: any;
  control?: any;
  searchSub?: Subscription;
  @Input('controlName') controlName?: any;
  @Input('group') group?: any;
  @Input('width') width?: string;
  @Input('label') label?: any;
  @Input('callApiFunction') callApiFunction?: any;
  @Input('selectValueAsObject') selectValueAsObject?: any;
  @Input('searchType') searchType: 'back' | 'front' = 'back';
  @Input('readonly') readonly: boolean = false;
  @Input('queryParams') queryParams!: any;
  @ViewChild(MatSelect) matSelect!: MatSelect;
  @Output('selectionChange') selectionChange = new EventEmitter<string>();
  isLoading = false;
  isScrolling = false;
  dataEnd = false;
  options: any[] = [];
  allOptions: any[] = [];
  page = 0;
  constructor(@Inject(INJECTOR) injector: Injector, private _cdr: ChangeDetectorRef) {
    super(injector);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['readonly']?.currentValue === true) {
      this.group?.get(this.controlName)?.disable();
    }
    if (changes && changes['readonly']?.currentValue === false) {
      this.group?.get(this.controlName)?.enable();
    }
  }
  ngOnInit() {
    if (typeof this.controlName === 'string') this.control = this.group.get(this.controlName);
    else this.control = this.controlName;
    this.searchSub = this.myControl.valueChanges
      .pipe(
        debounceTime(400),
        switchMap(res => {
          if (this.searchType == 'front') return of(res);
          else {
            return this.getData(0, res || '');
          }
        }),
        map(value => this._filter(value || ''))
      )
      .subscribe(data => {
        if (data.length >= 10) this.dataEnd = false;
      });
    this.fillArray();
  }

  fillArray() {
    let value = this.control?.value;
    if (value) {
      this.group?.get(this.controlName)?.patchValue(this.selectValueAsObject ? value : value.id, { emitEvent: false });
      this.selectedOption = value;
      this._cdr.detectChanges();
    }

    this.group
      .get(this.controlName)
      ?.valueChanges?.pipe(untilDestroyed(this))
      .subscribe((value: any) => {
        if (value && typeof value === 'object') {
          if (this.searchType == 'front') this.myControl.reset();
          this.selectedOption = value;
          this.group
            .get(this.controlName)
            .patchValue(this.selectValueAsObject ? value : value.id, { emitEvent: false });
          this._cdr.detectChanges();
        } else if (!value) {
          this.selectedOption = undefined;
        }
      });
  }

  private _filter(value: string | IResponse<IEnum[]> | null): IEnum[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();

      let filter = this.allOptions?.filter(
        option => option.name.toLowerCase().includes(filterValue) && option.id !== this.selectedOption?.id
      );
      this.options = filter;
      return filter;
    } else {
      this.options = value?.data?.filter(option => option.id !== this.selectedOption?.id) || [];
      return value?.data || [];
    }
  }
  open() {
    this.searchInput.nativeElement.focus();
  }
  catchData(event: any) {
    if (this.selectValueAsObject) this.selectedOption = event.value;
    else this.selectedOption = this.options?.find(option => event.value == option.id);
    this.selectionChange.next(this.selectedOption.id);
    if (this.searchType === 'front') this.myControl.reset();
  }

  getOptions() {
    if (!this.isLoading && this.callApiFunction && !this.readonly) {
      this.matSelect.close();
      this.isLoading = true;
      this.getData(this.searchType == 'back' ? 0 : null, this.myControl?.value || '').subscribe({
        next: (res: IResponse<IEnum[]>) => {
          this.options = res.data.filter(option => option.id !== this.selectedOption?.id);
          this.allOptions = res.data.filter(option => option.id !== this.selectedOption?.id);
          //    this.myControl.reset();
          if (res.data.length >= 10) this.dataEnd = false;
          this._cdr.detectChanges();
          this.matSelect.open();
          this.page = 0;
          this.isScrolling = false;
        },
        error: (err: any) => {
          this.isScrolling = false;
          this.isLoading = false;
        },
      });
    }
  }

  onScroll(_scrollPosition: number) {
    if (!this.isScrolling && this.searchType == 'back' && !this.dataEnd && !this.isLoading) {
      this.isScrolling = true;
      this.getData(this.page + 1, this.myControl.value || '').subscribe({
        next: (res: IResponse<IEnum[]>) => {
          if (res.data.length < 10) this.dataEnd = true;
          this.options = [...this.options, ...res.data].filter(option => option.id !== this.selectedOption?.id);
          this._cdr.detectChanges();
          this.matSelect.open();
          this.page++;
          this.isScrolling = false;
        },
        error: (err: any) => {
          this.isScrolling = false;
          this.isLoading = false;
        },
      });
    }
  }

  getData(page: number | null, value?: string) {
    return <Observable<IResponse<IEnum[]>>>this.callApiFunction(value, page, this.queryParams).pipe(
      finalize(() => {
        this.isLoading = false;
        this.isScrolling = false;
      }),
      catchError(err => of([]))
    );
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.searchSub?.unsubscribe();
  }
}
