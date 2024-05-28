import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IEnum } from 'src/app/core/interfaces/enum.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CustomerService } from '../../../services/customer.service';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { CUSTOMER_STATUS } from '../../../constants/customer-types.constant';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { Component, EventEmitter, INJECTOR, Inject, Injector, Input, Output } from '@angular/core';
import { HijriGregorianDatePipe } from 'src/app/core/pipes/hijriGregorian-date.pipe';

@UntilDestroy()
@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.scss'],
  providers: [HijriGregorianDatePipe],
})
export class PersonalDataComponent extends CoreBaseComponent {
  @Input() personalDataGroup!: FormGroup;
  @Output() hideStep2 = new EventEmitter<boolean>();
  @Input() startWithNumber!: string;
  public customerTypes: IEnum[] = [];
  public vipCustomerOptions = CUSTOMER_STATUS;
  public customerId!: string;
  public allIdentificationTypes!: IEnum[];

  get identificationTypeValue(): number {
    const identificationTypeId = this.personalDataGroup.controls['identificationTypeId']?.value;
    return (
      this.allIdentificationTypes?.find(r => {
        return r.id === identificationTypeId;
      })?.value || -1
    );
  }

  constructor(
    @Inject(INJECTOR) injector: Injector,
    public customerService: CustomerService,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _hijriGregorianDatePipe: HijriGregorianDatePipe
  ) {
    super(injector);
  }

  ngOnInit(): void {
    // this.getIdentificationTypes()
    //   .pipe(untilDestroyed(this))
    //   .subscribe(response => (this.allIdentificationTypes = response.data));
    this.initializeForm();
    this.watchIdentificationType();
    this.customerId = this._activatedRoute.snapshot.params['id'];
  }

  initializeForm(): void {
    this.getCustomerTypesEnum();

    this.personalDataGroup
      .get('customerTypeId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe((id: string) => {
        this.handleCustomerTypeChange(id);
      });
  }

  watchIdentificationType() {
    this.personalDataGroup.controls['identificationTypeId'].valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.startWithNumber =
        +this.identificationTypeValue === 2 ? '-2' : +this.identificationTypeValue === 1 ? '-1' : '-1';
    });
  }

  getCustomerTypesEnum(): void {
    this.getCustomerTypes().subscribe(res => {
      this.customerTypes = res.data;
      const customerTypeId = this.personalDataGroup.get('customerTypeId')?.value;
      if (customerTypeId) {
        if (customerTypeId !== this.customerTypes[0].id) {
          this.handleCustomerTypeChange(customerTypeId);
        } else {
          this.personalDataGroup.get('customerTypeId')?.setValue(this.customerTypes[0].id, { emitEvent: false });
        }
      } else {
        this.handleCustomerTypeChange(this.customerTypes[0].id as string);
      }
    });
  }

  handleCustomerTypeChange(id: string): void {
    if (id === this.customerTypes[0]?.id) {
      this.personalDataGroup.get('customerTypeId')?.setValue(this.customerTypes[0].id, { emitEvent: false });
      this.hideStep2.emit(true);
      this.removeBusinessControls();
    } else if (id === this.customerTypes[1]?.id) {
      this.personalDataGroup.get('customerTypeId')?.setValue(this.customerTypes[1].id, { emitEvent: false });
      this.hideStep2.emit(false);
      this.addBusinessControls();
    }
  }

  removeBusinessControls(): void {
    const parentFormGroup = this.personalDataGroup.parent as FormGroup;
    parentFormGroup?.removeControl('business');
    parentFormGroup?.removeControl('businessArr');
    parentFormGroup?.updateValueAndValidity();
  }

  addBusinessControls(): void {
    const business = this._fb.group({
      id: [crypto.randomUUID()],
      nameAr: [null, [TextValidator.arabic]],
      nameEn: [null, [TextValidator.english]],
      creationDate: [this.getToday()],
      businessPositionId: [null],
      phone: [null],
      email: [null],
    });

    const businessArr = this._fb.array([], [Validators.required]);
    const parentFormGroup = this.personalDataGroup.parent as FormGroup;
    parentFormGroup?.setControl('business', business);
    if ((parentFormGroup.get('businessArr') as FormArray)?.controls?.length > 0) {
    } else {
      parentFormGroup?.setControl('businessArr', businessArr);
    }
    parentFormGroup?.updateValueAndValidity();
  }

  getToday(): string {
    const now = new Date();
    return now.toISOString();
  }

  convertToHijri(miladyDate: string): string {
    const hijriFormatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
    const hijriDate = new Date(hijriFormatter.format(new Date(miladyDate)).split('AH')[0]);

    return hijriDate.toString() !== 'Invalid Date' ? hijriDate.toISOString() : '';
  }
}
