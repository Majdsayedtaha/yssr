import { IContractFormData } from '../../models';
import { AppRoutes } from 'src/app/core/constants';
import { MatStepper } from '@angular/material/stepper';
import { Router, ActivatedRoute } from '@angular/router';
import { ContractService } from '../../services/contract.service';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { Component, INJECTOR, Inject, Injector, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NumberLengthNumberValidator } from 'src/app/core/validators/onlyNumber';

@Component({
  selector: 'app-recruitment-contract-form',
  templateUrl: './recruitment-contract-form.component.html',
  styleUrls: ['./recruitment-contract-form.component.scss'],
})
export class RecruitmentContractFormComponent extends CoreBaseComponent {
  @ViewChild(MatStepper, { static: true }) stepper!: MatStepper;
  public contractForm!: FormGroup;
  public employees!: any[];
  public contractId!: string;
  public customerId!: string;
  public name!: string;
  public musanedValuePercentage: number = 1;
  public isLoading: boolean = false;
  public loadingData = false;

  get finalForm(): IContractFormData {
    const form = this.contractForm.getRawValue();
    const contractForm: IContractFormData = {
      ...form.contractData,
      ...form.externalOfficeData,
      ...form.financialData,
      contractDateHijri:
        typeof form['contractData']['contractDateHijri'] === 'object'
          ? form['contractData']['contractDateHijri']['date']
          : form['contractData']['contractDateHijri'],
      visaDateHijri:
        typeof form['contractData']['visaDateHijri'] === 'object'
          ? form['contractData']['visaDateHijri']['date']
          : form['contractData']['visaDateHijri'],
      customerId: form['contractData']['customerId']['id'],
      saveWithSendEmail: form['saveWithSendEmail'],
      saveWithSendSms: form['saveWithSendSms'],
      code: 0,
    };
    return contractForm;
  }

  constructor(
    @Inject(INJECTOR) injector: Injector,
    public contractService: ContractService,
    private _fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initContractForm();
    this.contractId = this._activatedRoute.snapshot.params['id'];
    this.customerId = this._activatedRoute.snapshot.params['customerId'];
    this.name = this._activatedRoute.snapshot.params['name'];
    if (this.contractId) this.getContractData();
    if (this.customerId && this.name) this.setCustomerDetails();
  }

  initContractForm() {
    this.contractForm = this._fb.group({
      customer: this._fb.group({ customerId: [null, Validators.required], test: [null], searchCustomer: [null] }),
      contractData: this._fb.group({
        contractDateMilady: [null, Validators.required],
        contractDateHijri: [null, Validators.required],
        customerId: [null, Validators.required],
        visaNo: [null, [Validators.required, NumberLengthNumberValidator.number()]],
        visaTypeId: [null, Validators.required],
        visaDateMilady: [null, Validators.required],
        visaDateHijri: [null, Validators.required],
        religionId: [null, Validators.required],
        ageId: [null, Validators.required],
        jobId: [null, Validators.required],
        experienceTypeId: [null, Validators.required],
        countryId: [null, Validators.required],
      }),
      externalOfficeData: this._fb.group({
        externalOfficeId: [null, Validators.required],
        representativeId: [null, Validators.required],
        arrivalStationId: [null, Validators.required],
        externalOfficeAmount: [null],
        skillsIds: this._fb.array([], Validators.required),
      }),
      financialData: this._fb.group({
        taxTypeId: [null, Validators.required],
        discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
        transportationAmount: [0, [Validators.required, Validators.min(0)]],
        musanedRequestTypeId: [null, Validators.required],
        musanedRequestNum: [null, Validators.required],
        musanedRequestAmount: [null, [Validators.required, Validators.min(0)]],
        contractAmount: [0, Validators.min(0)],
        taxAmount: [0, Validators.min(0)],
        withoutTaxAmount: [0, Validators.min(0)],
        totalRecruitmentAmountWithTax: [0, Validators.min(0)],
        totalRecruitmentAmountWithoutTax: [0, Validators.min(0)],
        employees: this._fb.array([]),
        employee: [null],
        amount: [],
      }),
      saveWithSendEmail: [null],
      saveWithSendSms: [null],
    });
  }

  getFormGroup(name: string): FormGroup {
    return <FormGroup>this.contractForm?.get(name);
  }

  getFormArray(name: string): FormArray {
    return <FormArray>this.contractForm?.get(name);
  }

  getContractData() {
    this.contractForm.removeControl('customer');
    this.contractForm.updateValueAndValidity();
    this.loadingData = true;
    this.contractService.getContractDetails(this.contractId).subscribe(res => {
      this.employees = res.data.employees;
      this.fillContractFormData(res.data as IContractFormData);
      this.loadingData = false;
    });
  }

  setCustomerDetails() {
    const customer = { id: this.customerId, name: this.name };
    this.getFormGroup('contractData').get('customerId')?.setValue(customer, { emitEvent: true });
    this.contractForm.removeControl('customer');
    this.contractForm?.updateValueAndValidity();
  }

  fillContractFormData(customer: IContractFormData) {
    this.getFormGroup('contractData').patchValue({
      customerId: customer.customer,
      contractDateMilady: customer.contractDateMilady,
      contractDateHijri: customer.contractDateHijri,
      visaNo: customer.visaNo,
      visaTypeId: customer.visaType,
      visaDateMilady: customer.visaDateMilady,
      visaDateHijri: customer.visaDateHijri,
      religionId: customer.religion,
      ageId: customer.age,
      jobId: customer.job,
      experienceTypeId: customer.experienceType,
      countryId: customer.country,
    });
    this.getFormGroup('externalOfficeData').patchValue({
      externalOfficeId: customer.externalOffice,
      representativeId: customer.representative,
      externalOfficeAmount: customer.externalOfficeAmount,
      arrivalStationId: customer.arrivalStation,
    });
    this.getFormGroup('financialData').patchValue({
      contractAmount: customer.contractAmount,
      taxTypeId: customer.taxType,
      discount: customer.discount,
      taxAmount: customer.taxAmount,
      withoutTaxAmount: customer.withoutTaxAmount,
      transportationAmount: customer.transportationAmount,
      totalRecruitmentAmountWithTax: customer.totalWithTax,
      totalRecruitmentAmountWithoutTax: customer.totalWithoutTax,
      musanedRequestTypeId: customer.musanedRequestType,
      musanedRequestNum: customer.musanedRequestNum,
      musanedRequestAmount: customer.musanedRequestAmount,
      employees: customer.employees,
    });
    const skillFormArray = this.getFormGroup('externalOfficeData').get('skillsIds') as FormArray;
    customer.skillsIds.forEach(skillId => skillFormArray.push(new FormControl(skillId)));
    this.musanedValuePercentage = customer.musanedRequestType.value || 1;
  }

  submitContractForm(type: 'add' | 'update', withSendEmail?: boolean, withSendSms?: boolean) {
    // ADD
    if (type === 'add') {
      if (withSendEmail && withSendSms) {
        this.contractForm.get('saveWithSendEmail')?.setValue(true);
        // this.contractForm.get('saveWithSendSms')?.setValue(true);
        this.contractForm.get('saveWithSendSms')?.setValue(false);
      } else if (withSendEmail) {
        this.contractForm.get('saveWithSendEmail')?.setValue(true);
        // this.contractForm.get('saveWithSendSms')?.setValue(false);
        this.contractForm.get('saveWithSendSms')?.setValue(false);
      } else if (withSendSms) {
        // this.contractForm.get('saveWithSendSms')?.setValue(true);
        this.contractForm.get('saveWithSendSms')?.setValue(false);
        this.contractForm.get('saveWithSendEmail')?.setValue(true);
      } else {
        this.contractForm.get('saveWithSendSms')?.setValue(false);
        this.contractForm.get('saveWithSendEmail')?.setValue(false);
      }
      this.isLoading = true;
      this.contractService.addContract(this.finalForm).subscribe({
        complete: () => {
          this.isLoading = false;
          this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.contracts}/table`);
        },
        error: () => {
          this.isLoading = false;
        },
      });

      // Update
    } else if (type === 'update') {
      if (withSendEmail && withSendSms) {
        this.contractForm.get('saveWithSendEmail')?.setValue(true);
        this.contractForm.get('saveWithSendSms')?.setValue(true);
      } else if (withSendEmail) {
        this.contractForm.get('saveWithSendEmail')?.setValue(true);
        this.contractForm.get('saveWithSendSms')?.setValue(false);
      } else if (withSendSms) {
        this.contractForm.get('saveWithSendSms')?.setValue(true);
        this.contractForm.get('saveWithSendEmail')?.setValue(true);
      } else {
        this.contractForm.get('saveWithSendSms')?.setValue(false);
        this.contractForm.get('saveWithSendEmail')?.setValue(false);
      }
      this.isLoading = true;
      this.contractService.updateContract(this.contractId, this.finalForm).subscribe({
        next: res => {
          this.isLoading = false;
        },
        complete: () => {
          this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.contracts}/table`);
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }
}
