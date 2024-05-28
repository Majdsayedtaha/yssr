import { IEnum } from 'src/app/core/interfaces';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { IBusiness, ICustomerFormData } from '../../models';
import { CustomerService } from '../../services/customer.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DialogService } from 'src/app/core/services/dialog.service';
import { AppRoutes, CUSTOMER_STEP_KEY } from 'src/app/core/constants';
import { StorageService } from 'src/app/core/services/storage.service';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { Component, INJECTOR, Inject, Injector, OnDestroy, ViewChild } from '@angular/core';
import { DialogIdentityComponent } from '../toaster/dialog-identity/dialog-identity.component';
import { FakeLengthNumberValidator } from 'src/app/core/validators/fakeLengthNumber-number.validator';

@UntilDestroy()
@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
})
export class CustomerFormComponent extends CoreBaseComponent implements OnDestroy {
  @ViewChild(MatStepper, { static: true }) stepper!: MatStepper;
  public hideStep2 = true;
  public customerForm!: FormGroup;
  public customerId!: string;
  public existingCustomerData!: ICustomerFormData;
  public allIdentificationTypes!: IEnum[];
  public startWithNumber: string = '-1';
  business: any[] = [];
  loading = false;
  postLoading = false;
  customer!: { id: string; name: string };

  get identificationTypeValue(): number {
    const identificationTypeId = this.getFormGroup('personalData').controls['identificationTypeId']?.value;
    return (
      this.allIdentificationTypes?.find(r => {
        return r.id === identificationTypeId;
      })?.value || -1
    );
  }

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private fb: FormBuilder,
    private _storageService: StorageService,
    private _dialogService: DialogService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public customerService: CustomerService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.customerId = this._activatedRoute.snapshot.params['id'];
    this.initCustomerForm();
    if (this.customerId) {
      (this.customerForm.get('personalData') as FormGroup)?.addControl('financialStatusId', this.fb.control(null));
      (this.customerForm.get('personalData') as FormGroup)?.get('financialStatusId')?.updateValueAndValidity();
      this.getCustomerData();
    } else this.checkDialogIdentityComponent();
    // this.getIdentificationTypes()
    //   .pipe(untilDestroyed(this))
    //   .subscribe(response => (this.allIdentificationTypes = response.data));
  }

  initCustomerForm() {
    let businessArr: any;
    if (this.customerId) businessArr = this.fb.array([]);
    else businessArr = this.fb.array([], [Validators.required]);
    this.customerForm = this.fb.group({
      personalData: this.fb.group({
        nameAr: [null, [TextValidator.arabic, Validators.required]],
        nameEn: [null, [TextValidator.english, Validators.required]],
        birthDateMilady: [null, Validators.required],
        birthDateHijri: [null, Validators.required],
        identificationTypeId: [null, Validators.required],
        identificationNumber: [null, [Validators.required, FakeLengthNumberValidator.number()]],
        identificationExpireDate: [null, Validators.required],
        identificationExpireDateHijri: [null, Validators.required],
        maritalStatusId: [null, Validators.required],
        email: [null, Validators.required],
        phone1: [null, Validators.required],
        phone2: [null, Validators.nullValidator],
        homeTypeId: [null, Validators.required],
        workersCount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
        customerTypeId: [null, Validators.required],
        vipCustomer: [false, Validators.required],
        familyMembersCount: [0, [Validators.required, Validators.min(0), Validators.max(20)]],
      }),
      business: this.fb.group({
        id: [crypto.randomUUID()],
        nameAr: [null, [TextValidator.arabic]],
        nameEn: [null, [TextValidator.english]],
        creationDate: [this.getToday()],
        businessPositionId: [null],
        phone: [null],
        email: [null],
      }),
      businessArr: businessArr,
      nationalAddress: this.fb.group({
        street: [null, [Validators.required, TextValidator.arabic]],
        streetEn: [null, [Validators.required, TextValidator.english]],
        district: [null, [Validators.required, TextValidator.arabic]],
        districtEn: [null, [Validators.required, TextValidator.english]],
        regionId: [null, Validators.required],
        cityId: [null, Validators.required],
        postalCode: [null],
        additionalCode: [null],
        unitNumber: [null, Validators.required],
        buildingNumber: [null, Validators.required],
      }),
      customerData: this.fb.group({
        customerJob: [null, Validators.required],
        customerPosition: [null, Validators.required],
        workTel: [null],
        monthlyIncome: [0, [Validators.required, Validators.min(0)]],
        relativeName: [null, Validators.required],
        relativeType: [null, Validators.required],
        relativePhone: [null, Validators.required],
      }),
    });
  }

  getFormGroup(name: string): FormGroup {
    return <FormGroup>this.customerForm?.get(name);
  }

  getFormArray(name: string): FormArray {
    return <FormArray>this.customerForm?.get(name);
  }

  getCustomerData() {
    this.loading = true;
    this.customerService.getCustomerDetails(this.customerId).subscribe({
      next: res => {
        const customerData = res.data as ICustomerFormData;
        if (customerData.business) this.business = customerData.business;
        this.fillCustomerFormData(customerData);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  fillCustomerFormData(customer: ICustomerFormData) {
    this.getFormGroup('personalData').patchValue({
      nameAr: customer.nameAr,
      nameEn: customer.nameEn,
      birthDateMilady: customer.birthDateMilady,
      birthDateHijri: customer.birthDateHijri,
      identificationTypeId: customer.identificationType,
      identificationNumber: customer.identificationNumber.slice(1),
      identificationExpireDate: customer.identificationExpireDate,
      identificationExpireDateHijri: customer.identificationExpireDateHijri,
      phone1: customer.phone1,
      phone2: customer.phone2,
      maritalStatusId: customer.maritalStatus,
      financialStatusId: customer.financialStatus,
      email: customer.email,
      homeTypeId: customer.homeType,
      workersCount: customer.workersCount,
      customerTypeId: customer.customerTypeId,
      vipCustomer: customer.vipCustomer,
      familyMembersCount: customer.familyMembersCount,
    });

    this.fillBusinessArray(customer.business);
    // this.getFormGroup('business')?.patchValue({
    //   business: this.fillBusinessArray(customer.business),
    // });

    this.getFormGroup('nationalAddress').patchValue({
      street: customer.street,
      streetEn: customer.streetEn,
      district: customer.district,
      districtEn: customer.districtEn,
      regionId: customer.region,
      cityId: customer.city,
      postalCode: customer.postalCode,
      additionalCode: customer.additionalCode,
      unitNumber: customer.unitNumber,
      buildingNumber: customer.buildingNumber,
    });
    this.getFormGroup('customerData').patchValue({
      customerJob: customer.customerJob,
      customerPosition: customer.customerPosition,
      workTel: customer.workTel,
      monthlyIncome: customer.monthlyIncome ?? 0,
      relativeName: customer.relativeName,
      relativeType: customer.relativeType,
      relativePhone: customer.relativePhone,
      vatProcessId: customer.vatProcess,
    });
    this.startWithNumber = this.identificationTypeValue === 2 ? '-2' : this.identificationTypeValue === 1 ? '-1' : '-1';
  }

  fillBusinessArray(business: IBusiness[]) {
    business.forEach(b => {
      this.getFormArray('businessArr')?.push(this.fb.group(b));
    });
  }

  quickAccess(type: 'recruitment' | 'rent' | 'suretyTransfer' | 'bill' | 'table') {
    const form = this.customerForm.value;
    let customer: ICustomerFormData = {
      ...form.personalData,
      ...form.nationalAddress,
      ...form.customerData,
      business: [],
    };
    const prefix = this.identificationTypeValue === 1 ? '1' : this.identificationTypeValue === 2 ? '2' : '1';
    customer.identificationNumber = prefix + customer.identificationNumber;
    if (!this.hideStep2) customer = { ...customer, business: this.getFormArray('businessArr').value };
    if (type === 'bill') {
      // this.postLoading = true;
      // this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.contracts}/add-contract/${this.customer.id}/${this.customer.name}`);
    }
    if (type === 'recruitment') {
      this.postLoading = true;
      this.customerService.addCustomer(customer).subscribe({
        next: res => {
          this.customer = {
            id: (res.data as ICustomerFormData).id,
            name:
              this.getDirection() === 'ltr'
                ? (res.data as ICustomerFormData).nameEn
                : (res.data as ICustomerFormData).nameAr,
          };
        },
        complete: () => {
          this._router.navigateByUrl(
            `${AppRoutes.layout}/${AppRoutes.contracts}/add-contract/${this.customer.id}/${this.customer.name}`
          );
          this.postLoading = false;
        },
        error: () => {
          this.postLoading = false;
        },
      });
    }
    if (type === 'rent') {
      this.postLoading = true;
      this.customerService.addCustomer(customer).subscribe({
        next: res => {
          this.customer = {
            id: (res.data as ICustomerFormData).id,
            name:
              this.getDirection() === 'ltr'
                ? (res.data as ICustomerFormData).nameEn
                : (res.data as ICustomerFormData).nameAr,
          };
        },
        complete: () => {
          this._router.navigateByUrl(
            `${AppRoutes.layout}/${AppRoutes.rents}/add/${this.customer.id}/${this.customer.name}`
          );
          this.postLoading = false;
        },
        error: () => {
          this.postLoading = false;
        },
      });
    }
    if (type === 'suretyTransfer') {
      this.postLoading = true;
      this.customerService.addCustomer(customer).subscribe({
        next: res => {
          this.customer = {
            id: (res.data as ICustomerFormData).id,
            name:
              this.getDirection() === 'ltr'
                ? (res.data as ICustomerFormData).nameEn
                : (res.data as ICustomerFormData).nameAr,
          };
        },
        complete: () => {
          this._router.navigateByUrl(
            `${AppRoutes.layout}/${AppRoutes.suretyTransfer}/add-order/${this.customer.id}/${this.customer.name}`
          );
          this.postLoading = false;
        },
        error: () => {
          this.postLoading = false;
        },
      });
    }
    if (type === 'table') {
      this.postLoading = true;
      this.customerService.addCustomer(customer).subscribe({
        complete: () => {
          this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.customers}/table`);
          this.postLoading = false;
        },
        error: () => {
          this.postLoading = false;
        },
      });
    }
  }

  updateCustomerForm() {
    this.postLoading = true;
    const form = this.customerForm.value;
    let customer: ICustomerFormData = {
      ...form.personalData,
      ...form.nationalAddress,
      ...form.customerData,
      birthDateHijri:
        typeof form.personalData.birthDateHijri === 'object'
          ? form.personalData.birthDateHijri.date
          : form.personalData.birthDateHijri,
      identificationExpireDateHijri:
        typeof form.personalData.identificationExpireDateHijri === 'object'
          ? form.personalData.identificationExpireDateHijri.date
          : form.personalData.identificationExpireDateHijri,
      business: [],
    };
    if (!this.hideStep2)
      customer = {
        ...customer,
        birthDateHijri:
          typeof form.personalData.birthDateHijri === 'object'
            ? form.personalData.birthDateHijri.date
            : form.personalData.birthDateHijri,
        business: this.getFormArray('businessArr').value,
      };
    const prefix = this.identificationTypeValue === 1 ? '1' : this.identificationTypeValue === 2 ? '2' : '1';
    customer.identificationNumber = prefix + customer.identificationNumber;
    this.customerService.updateCustomer(this.customerId, customer).subscribe({
      complete: () => {
        this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.customers}/table`);
        this.postLoading = false;
      },
      error: () => {
        this.postLoading = false;
      },
    });
  }

  // blockCustomer() {
  //   const toastData: IToastData = {
  //     messageContent: 'you_want_to_block_customer',
  //     firstButtonContent: 'cancel',
  //     secondButtonContent: 'yes',
  //     svgIcon: 'laptop-toast',
  //     centralize: true,
  //   };
  //   this._dialogService
  //     .openDialog(ToastComponent, {
  //       data: toastData,
  //     })
  //     .subscribe(res => {
  //       if (res)
  //         this.customerService.blockCustomer(this.customerId).subscribe(res => {
  //           this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.customers}/table`);
  //         });
  //     });
  // }

  checkDialogIdentityComponent() {
    this._dialogService.openDialog(DialogIdentityComponent, { disableClose: true }).subscribe(res => {
      if (!res.customer && (res.form?.identificationTypeId || res.form?.identificationNumber)) {
        this.startWithNumber =
          +res.form.identificationTypeId.value === 2 ? '-2' : +res.form.identificationTypeId.value === 1 ? '-1' : '-1';
        this.getFormGroup('personalData').patchValue({
          identificationTypeId: res.form.identificationTypeId,
          identificationNumber: res.form.identificationNumber,
        });
      }
    });
  }

  getToday(): string {
    const now = new Date();
    return now.toISOString();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._storageService.removeSessionObject(CUSTOMER_STEP_KEY);
  }
}
