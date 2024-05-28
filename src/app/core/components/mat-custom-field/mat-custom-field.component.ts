import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectorRef,
  Inject,
  INJECTOR,
  Injector,
  ViewChild,
  SimpleChanges,
  OnChanges,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { AbstractControlOptions, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { CoreBaseComponent } from '../base/base.component';
import { IEnum } from '../../interfaces/enum.interface';
import { CustomEmailValidator } from '../../validators/email.validator';
import {
  Observable,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  of,
  switchMap,
  fromEvent,
  filter,
  map,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponse } from '../../models';
import { MatSelect } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HttpClient } from '@angular/common/http';
import { NgxMaterialTimepickerTheme, NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { PhoneNumberValidator } from '../../validators/phone-number.validator';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import * as customEditor from '../../ckeditor5/build/ckeditor';
import { HIJRI_MONTHS_ARRAY, HIJRI_YEARS_ARRAY, MILADY_MONTHS_ARRAY, MILADY_YEARS_ARRAY } from './dates';
import { CompanyService } from 'src/app/modules/settings/services/company.service';
import { FullUrlPipe } from '../../pipes/full-url.pipe';
import { SanitizerUrlPipe } from '../../pipes/sanitizer-url.pipe';
import { SafeUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { NotifierService } from '../../services/notifier.service';
import { ICountryData } from '../../interfaces/country-data.interface';
import { countries } from '../../constants/countries';
type InputType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'searchableSelect'
  | 'tel'
  | 'date'
  | 'textarea'
  | 'file'
  | 'time_range'
  | 'editor'
  | 'url';

@UntilDestroy()
@Component({
  selector: 'mat-custom-field',
  templateUrl: './mat-custom-field.component.html',
  styleUrls: ['./mat-custom-field.component.scss'],
  providers: [{ provide: DateAdapter, useClass: NativeDateAdapter }, FullUrlPipe, SanitizerUrlPipe, DatePipe],
})
export class MatCustomFieldComponent extends CoreBaseComponent implements OnInit, OnChanges, AfterViewInit {
  //#region Decorators
  //Inputs
  @Input() readonly: boolean = false;
  @Input() compareControlName: string = '';
  @Input() compareLabel: string = '';
  @Input() disabled!: boolean;
  @Input() getStaticOptions!: boolean;
  @Input() rows: number = 3;
  @Input() group!: FormGroup;
  @Input() controlName!: string;
  @Input() options: IEnum[] = [];
  @Input() label: string = '';
  @Input() suffix: string = '';
  @Input() prefix: string = '';
  @Input() cursorStatus = false;
  @Input() apiEndpoint!: string;
  @Input() apiEndpointQueryParams!: object | null;
  @Input() queryParamWithEndpoint!: { name: string; value: string | number };
  @Input() textSuffix: string = '';
  @Input() textPrefix: string = '';
  @Input() minNumberValue!: number;
  @Input() maxNumberValue!: number;
  @Input() maxLengthValue!: number;
  @Input() hintMessage: string = '';
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() type: InputType = 'text';
  @Input() fileAccept!: 'image' | 'all';
  @Input() translateOptions = false;
  @Input() placeholder: string = '';
  @Input() imgSrc: string = '';
  @Input() textSuffixNT: any = '';
  @Input() showGrid: boolean = false;
  @Input() multiple: boolean = false;
  @Input() otherControlName!: string;
  @Input() callApiFunction!: Function;
  @Input() editorContentLang!: string;
  @Input() hijriFormat: boolean = false;
  @Input() selectValueAsObject: boolean = false;
  @Input() mask: string | null = null;
  @Input() customUrl: string | null = null;
  @Input() resetDate: boolean = false;
  @Input() dateRequired: boolean = true;
  //Outputs
  @Output() blurInput = new EventEmitter<boolean>();
  @Output() onSuffixCLicked = new EventEmitter<boolean>();
  @Output() onSearchableValueChange = new EventEmitter<any>();
  @Output() onDateChange = new EventEmitter<string>();
  @Output() dateLoadingHelper = new EventEmitter<boolean>();
  @Output() validitySearchableOptionHandler = new EventEmitter<boolean>(false);
  //ViewChild
  @ViewChild(MatSelect) matSelect!: MatSelect;
  @ViewChild('myEditor', { static: false }) myEditor: any;
  @ViewChild('searchableField') searchableField!: HTMLInputElement;
  @ViewChild('startTime') startTime!: NgxMaterialTimepickerComponent;
  @ViewChild('searchableChipsField') searchableChipsField!: ElementRef;
  @ViewChild('matAutocomplete') matAutocomplete!: MatAutocompleteTrigger;
  //#endregion

  //#region Variables
  public page: number = 0;
  public compareFailed: boolean = false;
  public isLoadingChips: boolean = false;
  public isLoading: boolean = false;
  public isScrolling: boolean = false;
  public fieldIsRequired = false;
  public suffixCLicked: boolean = false;
  public editorConfig!: any;
  public selectedSearchableOption!: IEnum;
  public filteredList: IEnum[] = [];
  public filteredListCopyForHint!: IEnum[];
  public copyFilteredList: IEnum[] = [];
  public input$ = new Subject<string>();
  public control = new FormControl<string>('');
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public dateForm!: FormGroup;
  public isGreater: string = '';
  public isSmaller: string = '';
  public miladyYears = MILADY_YEARS_ARRAY;
  public hijriYears = HIJRI_YEARS_ARRAY;
  public hijriMonths = HIJRI_MONTHS_ARRAY;
  public miladyMonths = MILADY_MONTHS_ARRAY;
  public days: number[] = [];
  public fileName: string | null = null;
  public isImage: string = '';
  // Ckeditor
  public editor: any = customEditor;
  // Timepicker Config.
  public primaryTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#424242',
      buttonColor: 'var(--primary-color)',
    },
    dial: {
      dialBackgroundColor: 'var(--primary-color)',
    },
    clockFace: {
      clockFaceBackgroundColor: '#555',
      clockHandColor: 'var(--primary-color)',
      clockFaceTimeInactiveColor: 'var(--white)',
    },
  };
  // Telephone field variables.
  countrySuffix: string = '+966';
  validNumberOfDigits: number = 9;
  telephoneConfigObj: any;
  telParentFormGroup!: FormGroup;
  //#endregion

  //#region Accessors
  get formControl(): FormControl<string> {
    return <FormControl<string>>this.group.get(this.controlName);
  }
  get compareControl(): FormControl<string> {
    return <FormControl<string>>this.group.get(this.compareControlName);
  }
  get formControlArray(): FormArray {
    return this.group.get(this.controlName) as FormArray;
  }
  //#endregion

  constructor(
    private _cdr: ChangeDetectorRef,
    @Inject(INJECTOR) injector: Injector,
    private apiHttpService: HttpClient,
    private _fb: FormBuilder,
    private _fullURlPipe: FullUrlPipe,
    private _sanitizerUrlPipe: SanitizerUrlPipe,
    private _companyService: CompanyService,
    private datePipe: DatePipe,
    private notifierService: NotifierService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.applyLogicTypes();
    this.formControl?.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      if (this.compareControl) this.compareDates();

      if (value) {
        if (this.type === 'date') {
          if (this.hijriFormat) {
            let date: string[] = [];
            if (typeof value === 'object') {
              const hijriObj: { date: string; monthDays: number } = value;
              date = hijriObj.date.includes('-') ? hijriObj.date.split('-') : hijriObj.date.split('/');
              this.days = [];
              this.fillDaysArray(hijriObj?.monthDays);
            } else {
              this.days = [];
              this.fillDaysArray(this.companyService?.numberOfMonthDays);
              date = value?.includes('-') ? value.split('-') : value.split('/');
            }
            this.dateForm.setValue(
              {
                year: +date[2],
                month: +date[1] - 1,
                day: +date[0],
              },
              { emitEvent: false }
            );
          } else {
            const date: string[] = value.includes('-') ? value.split('-') : value.split('/');
            let month;
            let day;
            let year;
            if (date[0].length > 2) {
              year = +date[0];
              month = +date[1];
              day = +date[2];
            } else {
              month = +date[0];
              day = +date[1];
              year = +date[2];
            }
            const newMonth = month - 1;
            const daysInMonth = this.miladyMonths[newMonth].numberOfDays;
            if (year && this.isLeapYear(year) && month === 1) this.fillDaysArray(29);
            else {
              this.days = [];
              this.fillDaysArray(daysInMonth);
            }

            this.dateForm.setValue(
              {
                year: year,
                month: month - 1,
                day: day,
              },
              { emitEvent: false }
            );
          }
        }
        if (this.type === 'tel') {
          if (value.includes('(')) {
            const suffixCountryCode = value.split('(')[1].split(')')[0];
            const phoneNumberValue = value.split('(')[1].split(')')[1];
            const country = countries.find(country => country.dialCode === suffixCountryCode);
            this.telephoneConfigObj.setCountry(country?.countryTwoLetters);
            this.telParentFormGroup.get('telControlField')?.setValue(phoneNumberValue);
          }
        }
      } else if (!value) {
        if (this.type === 'date') {
          this.days = [];
          this.dateForm.reset();
          if (this.resetDate) this.initTheCurrentYear();
        }
        if (this.type === 'tel') {
          this.telParentFormGroup.get('telControlField')?.reset();
        }
      }
    });

    this.group
      .get(this.compareControlName)
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(value => {
        this.compareDates();
      });
  }

  onYearChange(yearValue: number) {
    this.resetDayField();
    const monthIndex = this.dateForm.get('month')?.value;
    if (this.hijriFormat) {
      if (monthIndex >= 0) {
        this.isLoading = true;
        this._companyService.getMonthDays(`1/${+monthIndex + 1}/${+yearValue}`, true).subscribe(res => {
          this.isLoading = false;
          this.fillDaysArray(+res.data.monthDays);
        });
      }
    } else {
      if (this.isLeapYear(yearValue) && +monthIndex === 1) {
        this.fillDaysArray(29);
      } else if (monthIndex >= 0) {
        this.fillDaysArray(this.miladyMonths[+monthIndex].numberOfDays);
      }
    }
  }

  onMonthChange(monthIndex: number) {
    this.resetDayField();
    const yearValue = this.dateForm.get('year')?.value;
    const daysInMonth = this.miladyMonths[monthIndex].numberOfDays;
    if (this.hijriFormat) {
      if (yearValue) {
        this.isLoading = true;
        this._companyService
          .getMonthDays(`1/${+monthIndex + 1}/${+yearValue}`, this.hijriFormat ? true : false)
          .subscribe(res => {
            this.isLoading = false;
            this.fillDaysArray(+res.data.monthDays);
          });
      }
    } else {
      if (yearValue && this.isLeapYear(+yearValue) && monthIndex === 1) {
        this.fillDaysArray(29);
      } else {
        this.fillDaysArray(daysInMonth);
      }
    }
  }

  onDayChange(dayIndex: number) {
    const yearValue = this.dateForm.get('year')?.value;
    const monthIndex = this.dateForm.get('month')?.value;

    if (monthIndex !== null && monthIndex !== undefined) {
      if (yearValue && +monthIndex >= 0 && +dayIndex >= 0) {
        const completeDate = this.hijriFormat
          ? `${+dayIndex}/${+monthIndex + 1}/${+yearValue}`
          : `${+monthIndex + 1}/${+dayIndex}/${+yearValue}`;
        this.group.get(this.controlName)?.setValue(`${+monthIndex + 1}/${+dayIndex}/${+yearValue}`, {
          emitEvent: !this.hijriFormat,
        });
        this.compareDates();
        // : this.formControl.setValue(`${+dayIndex}/${+monthIndex + 1}/${+yearValue}`, { emitEvent: false });
        this.onDateChange.emit(completeDate);
        this.dateLoadingHelper.emit(true);
        this._companyService
          .getTransformedDate(completeDate, this.hijriFormat)
          .pipe(
            untilDestroyed(this),
            finalize(() => this.dateLoadingHelper.emit(false))
          )
          .subscribe(res => {
            const date = (res.data.date as string).includes('-') ? res.data.date.split('-') : res.data.date.split('/');
            this.companyService.numberOfMonthDays = +res.data.monthDays;
            this.hijriFormat
              ? this.group.get(this.otherControlName)?.setValue(`${+date[0]}-${+date[1]}-${+date[2]}`)
              : this.group.get(this.otherControlName)?.setValue(`${+date[2]}-${+date[1]}-${+date[0]}`);
          });
      }
    }
  }

  compareDates() {
    if (this.compareControlName && this.formControl.value) {
      let start = new Date(this.compareControl.value);
      let end = new Date(this.formControl.value);
      if (start > end) {
        this.compareFailed = true;
        this.formControl.setErrors({ compareDate: true });
      } else {
        if (this.formControl.hasError('compareDate') && this.formControl.errors) {
          delete this.formControl.errors['compareDate'];
          if (Object.keys(this.formControl.errors).length === 0) {
            this.formControl.setErrors(null);
          }
        }
        this.compareFailed = false;
      }
    }
  }

  private resetDayField() {
    this.dateForm.get('day')?.reset('');
    this.days = [];
  }

  private fillDaysArray(daysCount: number) {
    for (let i = 1; i <= daysCount; i++) {
      this.days.push(i);
    }
  }

  private isLeapYear(year: number): boolean {
    return year % 4 === 0;
  }

  applyLogicTypes() {
    if (this.group.get(this.controlName)?.hasValidator(Validators.required)) {
      this.fieldIsRequired = true;
    }
    if (this.type === 'tel') {
      this.telParentFormGroup = this._fb.group({
        telControlField: [''],
      });
      this._cdr.detectChanges();
      if (this.group.get(this.controlName)?.hasValidator(Validators.required)) {
        this.telParentFormGroup.get('telControlField')?.addValidators([Validators.required]);
        this.telParentFormGroup.get('telControlField')?.updateValueAndValidity();
      }
    } else if (this.type === 'email') {
      this.group.get(this.controlName)?.addValidators([CustomEmailValidator.email]);
      this._cdr.detectChanges();
    } else if (this.type === 'select' && !this.multiple) {
      let value = this.group?.get(this.controlName)?.value;

      if (value && typeof value === 'object') {
        this.options = [];
        this.group
          ?.get(this.controlName)
          ?.patchValue(this.selectValueAsObject ? value : value.id, { emitEvent: false });
        this.options.push(value);
        this._cdr.detectChanges();
      }
      this.group
        ?.get(this.controlName)
        ?.valueChanges?.pipe(untilDestroyed(this))
        .subscribe(value => {
          if (value && typeof value === 'object') {
            const selectedOptionValue = this.selectValueAsObject ? value : value.id;
            this.options = this.options.filter(o => o.id === selectedOptionValue.id);
            this.group?.get(this.controlName)?.patchValue(selectedOptionValue, { emitEvent: false });
            this.options.push(value);

            this._cdr.detectChanges();
          }
        });
    } else if (this.type === 'select' && this.multiple) {
      this.group
        ?.get(this.controlName)
        ?.valueChanges?.pipe(untilDestroyed(this))
        .subscribe(() => {
          this.filteredList = [];
          this._cdr.detectChanges();
        });
    } else if (this.type === 'date') {
      this.createDateForm();
    } else if (this.type === 'time_range' && (this.readonly || this.disabled)) {
      this.group.get(this.controlName)?.disable();
    }
  }

  onYearPanelOpened() {
    if (!this.dateForm.get('year')?.value) {
      const currentYearOption = document.getElementById(
        `${this.hijriFormat ? this.currentHijriYear() : this.currentMiladyYear()}`
      );
      currentYearOption?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      this.dateForm.get('year')?.setValue(this.hijriFormat ? this.currentHijriYear() : this.currentMiladyYear());
    }
  }

  createDateForm() {
    this.dateForm = this._fb.group(
      {
        year: [null],
        month: [null],
        day: [null],
      },
      { validator: this.checkRangeDate() } as AbstractControlOptions
    );
    this.initTheCurrentYear();
    if (this.readonly) this.dateForm.disable();
    if (this.dateRequired) {
      this.dateForm.get('month')?.setValidators([Validators.required]);
      this.dateForm.get('day')?.setValidators([Validators.required]);
      this.dateForm.get('month')?.updateValueAndValidity();
      this.dateForm.get('day')?.updateValueAndValidity();
    }
  }

  checkRangeDate() {
    return (form: FormGroup) => {
      let date = this.formDate(form);
      if (date) {
        if (this.minDate) {
          if (this.minDate > date) {
            let isGreater = this.datePipe.transform(this.minDate, 'yyyy-MM-dd')!;
            this.isGreater = 'invalid';
            this.formControl.setErrors({ greaterDate: true });
            this.notifierService.showNotification(
              this.translateService.instant('fields_validation.small-date', { compare: isGreater })
            );
          } else {
            this.isGreater = '';
            this.removeDateInvalid('greaterDate');
            this.notifierService.dismiss();
          }
        }
        if (this.maxDate) {
          if (this.maxDate < date) {
            let isSmaller = this.datePipe.transform(this.maxDate, 'yyyy-MM-dd')!;
            this.isSmaller = 'invalid';
            this.formControl.setErrors({ smallerDate: true });
            this.notifierService.showNotification(
              this.translateService.instant('fields_validation.must-smaller', { date: isSmaller })
            );
          } else {
            this.isSmaller = '';
            this.removeDateInvalid('smallerDate');
            this.notifierService.dismiss();
          }
        }
      }
    };
  }

  removeDateInvalid(errorName: string) {
    if (this.formControl.hasError(errorName) && this.formControl.errors) {
      delete this.formControl.errors[errorName];
      if (Object.keys(this.formControl.errors).length === 0) {
        this.formControl.setErrors(null);
      }
    }
  }

  formDate(form: FormGroup) {
    if (form.value?.year && form.value?.month >= 0 && form.value?.day && !this.hijriFormat)
      return new Date(`${form.value?.year}-${form.value?.month + 1}-${form.value?.day}`);
    else return null;
  }

  initTheCurrentYear() {
    this.dateForm.get('year')?.setValue(this.hijriFormat ? this.currentHijriYear() : this.currentMiladyYear(), {
      emitEvent: false,
    });
  }

  currentMiladyYear(): number {
    const now = new Date();
    return now.getFullYear();
  }

  currentHijriYear(): number {
    const now = new Date();
    const hijriYear = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
      year: 'numeric',
    }).format(now);
    return parseInt(hijriYear, 10);
  }

  onSuffixCLick() {
    if (!this.cursorStatus) return;
    this.suffixCLicked = !this.suffixCLicked;
    this.onSuffixCLicked.emit(this.suffixCLicked);
  }

  getOptions() {
    if ((this.isLoading && this.callApiFunction) || this.group.controls[this.controlName].disabled) return;
    this.matSelect.close();
    this.isLoading = true;
    <Observable<IResponse<IEnum[]>>>this.callApiFunction()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError(err => of([]))
      )
      .subscribe((res: IResponse<IEnum[]>) => {
        const copyOptions: IEnum[] = res.data;
        const value = this.selectValueAsObject
          ? this.group?.get(this.controlName)?.value?.id
          : this.group?.get(this.controlName)?.value;

        if (value) {
          const selectedOption = copyOptions.find(o => value === o.id);
          const selectedOptionIndex = copyOptions.findIndex(o => value === o.id);
          if (selectedOption) {
            this.options = [this.options.filter(e => e.id === selectedOption.id)[0]];
            selectedOptionIndex > -1 ? copyOptions.splice(selectedOptionIndex, 1) : '';
          }
        }
        this.options.push(...copyOptions);
        this._cdr.detectChanges();
        this.matSelect.open();
      });
  }

  dateChanged() {
    if (this.otherControlName) {
      const currentDate = this.group.controls[this.controlName].value;
      this.group.controls[this.otherControlName].patchValue(currentDate);
    }
    this.blurInput.next(true);
  }

  toggleCheckBoxes(event: MatCheckboxChange) {
    const checked: boolean = event.checked;
    const value: string = event.source.value;
    const formArray: FormArray = this.group.get(this.controlName) as FormArray;

    /* Selected */
    if (checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(value));
    } else {
      /* unselected */
      // find the unselected element
      let i: number = 0;
      formArray.controls.forEach(ctrl => {
        if (ctrl.value == value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  checkExistInArray(Id: string): boolean {
    const array = this.group.get(this.controlName) as FormArray;
    return array.value.includes(Id);
  }

  setFile(event: any) {
    if (event.target && event.target.files) {
      let file: File = event.target.files[0];
      this.fileName = file?.name;
      this.group.controls[this.controlName].setValue(file);
      if (file) {
        this.isImage = event.target.files[0].type.includes('image');
        if (this.isImage) this.imgSrc = URL.createObjectURL(event.target.files[0]);
        this.customUrl = null;
      }
    } else {
      //no selected file
    }
  }

  removeFile() {
    this.fileAccept;
    this.group.controls[this.controlName].reset();
    this.imgSrc = '';
    this.fileName = '';
    this.isImage = '';
    this.customUrl = null;
  }

  // Searchable Select Logic
  getAllOptionsList() {
    this.isLoading = true;
    this.isLoadingChips = true;
    this.getList('').subscribe({
      next: (res: any) => {
        this.filteredList = this.copyFilteredList = res?.data;
        this.filteredListCopyForHint = this.filteredList;
        this.isLoading = false;
        this.isLoadingChips = false;
      },
      error: () => {
        this.filteredList = [];
        this.filteredListCopyForHint = this.filteredList;
        this.isLoading = false;
        this.isLoadingChips = false;
      },
    });
  }

  getList = (query: string, page?: number) => {
    const url = this.queryParamWithEndpoint?.value
      ? `${environment.baseURL}/${this.apiEndpoint}?PageNumber=${page || this.page}&${
          this.queryParamWithEndpoint.name
        }=${this.queryParamWithEndpoint.value}`
      : `${environment.baseURL}/${this.apiEndpoint}?PageNumber=${page || this.page}`;

    let urlWithQ = query ? url + `&Query=${query}` : url;
    if (this.apiEndpointQueryParams)
      urlWithQ = [urlWithQ, this.convertObjectIntoQueryParam(this.apiEndpointQueryParams)].join('&');

    return this.apiHttpService
      .get(urlWithQ, {
        headers: { skip: 'true' },
      })
      .pipe(
        map((res: any) => {
          if (!Array.isArray(res.data)) return { data: res?.data?.list };
          return res;
        })
      );
  };

  convertObjectIntoQueryParam(options: any) {
    if (options) {
      let params = new URLSearchParams();
      for (let key in options) {
        params.set(key, options[key]);
      }
      return params.toString();
    }
    return '';
  }

  optionSelected({ option }: MatAutocompleteSelectedEvent) {
    this.selectedSearchableOption = option.value;
    this.formControl?.setValue(option.value.id);
    this.onSearchableValueChange.emit(option.value.id);
  }
  optionSelectedSearchable(e: any) {
    this.onSearchableValueChange.emit(e);
  }
  //#region Mat Chips
  optionSelectedMatChips({ option }: MatAutocompleteSelectedEvent) {
    this.selectedSearchableOption = option.value;
    const formArray = this.group.get(this.controlName) as FormArray;
    formArray.push(new FormControl(this.selectedSearchableOption));
  }

  removeSelectMatChips(selectedId: string): void {
    const array = this.group.get(this.controlName) as FormArray;
    const index = array.controls.findIndex(control => control.value.id == selectedId);

    if (index >= 0) {
      array.controls.splice(index, 1);
    }
  }
  //#endregion

  displayOption(item?: any): string {
    return item ? item.name : '';
  }

  onTyping(event: Event) {
    const textValue = (event.target as HTMLInputElement).value;
    textValue === this.selectedSearchableOption?.name
      ? this.validitySearchableOptionHandler.emit(true)
      : this.validitySearchableOptionHandler.emit(false);
    this.input$.next(textValue);
  }

  onScroll(_scrollPosition: number) {
    if (this.copyFilteredList.length < 10) return;
    if (!this.isScrolling) {
      this.isScrolling = true;
      this.page++;
      const url = this.queryParamWithEndpoint?.value
        ? `${environment.baseURL}/${this.apiEndpoint}?Query=${
            this.control.value ? this.control.value : ''
          }&PageNumber=${this.page}&${this.queryParamWithEndpoint.name}=${this.queryParamWithEndpoint.value}`
        : `${environment.baseURL}/${this.apiEndpoint}?Query=${
            this.control.value ? this.control.value : ''
          }&PageNumber=${this.page}`;

      const urlWithQ = this.control.value ? url + `&Query=${this.control.value}` : url;

      this.apiHttpService
        .get(urlWithQ, {
          headers: { skip: 'true' },
        })
        .subscribe({
          next: (res: any) => {
            this.filteredList = [...this.filteredList, ...res.data];
            this.copyFilteredList = res.data;
            this.isScrolling = false;
          },
          error: () => {
            this.isScrolling = false;
          },
        });
    }
  }

  // changeLang() {
  // this.editor.destroy();
  // this.editorConfig.language = { ui: 'en', content: 'en' };
  // this.editor = customEditor;
  // }

  // Life Cycle Hooks
  ngAfterViewInit(): void {
    if (this.type == 'select' && this.multiple) {
      fromEvent(this.searchableChipsField.nativeElement, 'keyup')
        .pipe(
          filter(Boolean),
          debounceTime(1000),
          distinctUntilChanged(),
          untilDestroyed(this),
          switchMap(() => this.getList(this.searchableChipsField?.nativeElement.value))
        )
        .subscribe({
          next: (res: any) => {
            this.filteredList = this.copyFilteredList = res?.data;
            this.isLoading = false;
            this.isLoading = false;
          },
          error: () => {
            this.filteredList = [];
            this.isLoading = false;
          },
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.editorConfig = {
      toolbar: {
        items: [
          'heading',
          '|',
          'fontFamily',
          'fontBackgroundColor',
          'fontColor',
          'fontSize',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          'blockQuote',
          '|',
          'outdent',
          'indent',
          'alignment',
          'removeFormat',
        ],
      },
      language: {
        ui: 'ar',
        content: this.editorContentLang,
      },
    };

    if (changes['disabled']) {
      if (changes['disabled']?.firstChange || changes['disabled']?.currentValue) {
        this.formControl?.disable({ emitEvent: false });
        if (this.dateForm) {
          this.dateForm.get('year')?.disable();
          this.dateForm.get('month')?.disable();
          this.dateForm.get('day')?.disable();
        }
      } else {
        this.formControl?.enable({ emitEvent: false });
        if (this.dateForm) {
          this.dateForm.get('year')?.enable();
          this.dateForm.get('month')?.enable();
          this.dateForm.get('day')?.enable();
        }
      }
    }

    if (changes && typeof changes['dateRequired']?.currentValue === 'boolean') {
      if (changes['dateRequired']?.currentValue === true) {
        this.dateForm?.get('month')?.setValidators([Validators.required]);
        this.dateForm?.get('day')?.setValidators([Validators.required]);
        this.dateForm?.get('month')?.updateValueAndValidity();
        this.dateForm?.get('day')?.updateValueAndValidity();
      } else if (changes['dateRequired']?.currentValue === false) {
        this.dateForm?.get('month')?.removeValidators([Validators.required]);
        this.dateForm?.get('day')?.removeValidators([Validators.required]);
        this.dateForm?.get('month')?.updateValueAndValidity();
        this.dateForm?.get('day')?.updateValueAndValidity();
      }
    }
  }

  isNumber(x: any): boolean {
    return typeof x === 'number' ? true : false;
  }

  downloadLink(url: string, fileName: string) {
    url = this._fullURlPipe.transform(url);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = `${fileName}.${url.substring(-3)}`;
    document.body.appendChild(link);
    link.click();
  }

  previewSelectedFile(): string | SafeUrl | null {
    const pathPdfDoc = 'assets/svg/doc.svg';
    if (this.customUrl && this.fileName == null) {
      const extension = this.customUrl.slice(-3);
      const imageMimeData = ['jpg', 'jpeg', 'png', 'gif'];
      return imageMimeData.includes(extension) ? this._fullURlPipe.transform(this.customUrl) : pathPdfDoc;
    }
    if (this.fileName) {
      return this.isImage ? this._sanitizerUrlPipe.transform(this.imgSrc) : pathPdfDoc;
    }
    return null;
  }

  onCountryChange(countryData: ICountryData) {
    this.countrySuffix = '+' + countryData.dialCode;
    this.validNumberOfDigits = countries.find(country => country.dialCode === this.countrySuffix)?.numberOfDigits || 9;
    // this.telParentFormGroup
    //   .get('telControlField')
    //   ?.addValidators([PhoneNumberValidator.phone(this.validNumberOfDigits)]);
    const oldValue = this.telParentFormGroup.get('telControlField')?.value;
    this.telParentFormGroup.get('telControlField')?.setValue(oldValue.slice(0, this.validNumberOfDigits));
    this.telParentFormGroup.get('telControlField')?.updateValueAndValidity();
  }

  telInputObject(obj: any) {
    this.telephoneConfigObj = obj;
  }

  onTelInputBlur(e: any) {
    if (e.target.value) this.group.get(this.controlName)?.setValue(`(${this.countrySuffix})${e.target.value}`);
  }
}
