import { map, of, switchMap } from 'rxjs';
import { IEnum } from 'src/app/core/interfaces';
import { IResponse } from 'src/app/core/models';
import { ActivatedRoute } from '@angular/router';
import { IRefund, IReturnWorkerData } from '../../models';
import { RefundService } from '../../services/refund.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { ContractProcedureService } from 'src/app/modules/recruitment-contracts/services/contract-procedure.service';

@UntilDestroy()
@Component({
  selector: 'app-add-order-form',
  templateUrl: './add-order-form.component.html',
  styleUrls: ['./add-order-form.component.scss'],
})
export class AddOrderFormComponent extends CoreBaseComponent implements OnInit {
  public requestId!: string;
  public addOrderForm!: FormGroup;
  public proceduresTypes: IEnum[] = [];
  public procedureTypeValue!: number | undefined;
  public returnWorkerData!: IReturnWorkerData | null;
  isLoading: boolean = false;
  loadingData: boolean = false;

  get f() {
    return this.addOrderForm.controls;
  }

  get customerProcedureValue(): number {
    const procedureTypeId = this.f['customerProcedureId']?.value;
    return (
      this.proceduresTypes?.find(r => {
        return r.id === procedureTypeId;
      })?.value || -1
    );
  }

  constructor(
    private _fb: FormBuilder,
    @Inject(INJECTOR) injector: Injector,
    private _refundService: RefundService,
    private _activatedRoute: ActivatedRoute,
    private _contractProcedureService: ContractProcedureService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.requestId = this._activatedRoute.snapshot.params['id'];
    this.initialForm();
    if (this.requestId) this.patchFormValues();
    this.getReturnWorkerDetails();
    this.catchTypesChange();
    this.catchOrderChanges();
  }

  initialForm() {
    this.addOrderForm = this._fb.group({
      date: [null, Validators.required],
      customerId: [null, Validators.required],
      workerId: [null, [Validators.required]],
      customerProcedureId: [null, Validators.required],
      visaCost: [0, [Validators.nullValidator, Validators.min(0)]],
      accommodationFee: [0, [Validators.nullValidator, Validators.min(0)]],
      workerSalary: [0, [Validators.nullValidator, Validators.min(0)]],
      recruitAmount: [0, [Validators.nullValidator]],
      customerRecruitAmount: [0, [Validators.nullValidator]],
      note: [null],
      recruitmentContractId: [null, Validators.required],
    });
  }

  catchOrderChanges() {
    this.addOrderForm.valueChanges.pipe(untilDestroyed(this)).subscribe(values => {
      let visaCostValue = +(values['visaCost'] ?? 0);
      let accommodationFeeValue = +(values['accommodationFee'] ?? 0);
      let oldValue = +(values['customerRecruitAmount'] ?? 0);
      this.addOrderForm.controls['customerRecruitAmount'].patchValue(visaCostValue + accommodationFeeValue + oldValue, { emitEvent: false });
    });
  }

  catchTypesChange() {
    const array = ['visaCost', 'accommodationFee', 'workerSalary', 'recruitAmount', 'customerRecruitAmount'];
    this.addOrderForm
      .get('customerProcedureId')
      ?.valueChanges.pipe()
      .subscribe(v => {
        if (v) {
          this.procedureTypeValue = v.value;
          this.procedureTypeValue === 1
            ? this.updateValidation(this.addOrderForm, array, Validators.required)
            : this.updateValidation(this.addOrderForm, array, Validators.nullValidator);
        }
      });
  }

  patchFormValues() {
    this.loadingData = true;
    this.refundService
      .getOrderDetails(this.requestId)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.addOrderForm.patchValue({
          date: res.data.date,
          customerId: res.data.customer,
          workerId: res.data.worker,
          visaCost: res.data.visaCost,
          accommodationFee: (res.data as any).accomodationFee,
          workerSalary: res.data.workerSalary,
          recruitAmount: res.data.recruitAmount,
          customerRecruitAmount: res.data.customerRecruitAmount,
          customerProcedureId: res.data.customerProcedure,
          note: res.data.note,
          recruitmentContractId: res.data.recruitmentContract,
        });
        this.loadingData = false;
        this.addOrderForm.updateValueAndValidity();
      });
  }

  getReturnWorkerDetails() {
    this.addOrderForm
      .get('customerId')
      ?.valueChanges.pipe(
        untilDestroyed(this),
        switchMap(value => {
          const date = this.addOrderForm.get('date')?.value;
          const workerId = this.addOrderForm.get('workerId')?.value;
          if (!value || !workerId) return of({});
          return date ? this._contractProcedureService.getReturnWorkerDetails(value?.id || value, date) : of({});
        })
      )
      .subscribe((res: any) => {
        this.returnWorkerData = res.data;
        this.addOrderForm.patchValue({
          recruitmentContractId: this.returnWorkerData?.recruitmentContractId,
          visaCost: this.returnWorkerData?.visaCost,
          accommodationFee: this.returnWorkerData?.accommodationFee || 0,
          workerSalary: this.returnWorkerData?.workerSalary || 0,
          // ?There no deference between "officeAmount" and "recruitAmount".
          recruitAmount: this.returnWorkerData?.officeAmount || 0,
          // ?There no deference between "customerRecruitAmount" and "customerAmount".
          customerRecruitAmount: this.returnWorkerData?.customerAmount || 0,
        });
      });
  }
  update(e: any) {
    this.orderDateChange(this.addOrderForm.get('date')?.value);
  }
  orderDateChange(e: string) {
    const customerId = this.addOrderForm.get('customerId')?.value;
    const workerId = this.addOrderForm.get('workerId')?.value;
    if (!e || !customerId || !workerId) return;
    this._contractProcedureService.getReturnWorkerDetails(customerId, e, workerId).subscribe((res: any) => {
      this.returnWorkerData = res.data;
      this.addOrderForm.patchValue({
        recruitmentContractId: this.returnWorkerData?.recruitmentContractId,
        visaCost: this.returnWorkerData?.visaCost,
        accommodationFee: this.returnWorkerData?.accommodationFee || 0,
        workerSalary: this.returnWorkerData ? this.returnWorkerData.workerSalary : 0,
        recruitAmount: this.returnWorkerData ? this.returnWorkerData.officeAmount : 0,
        customerRecruitAmount: this.returnWorkerData ? this.returnWorkerData.customerAmount : 0,
      });
    });
  }

  getCustomerProceduresEnum = () => {
    return this.getCustomerProcedures().pipe(
      untilDestroyed(this),
      map((res: IResponse<IEnum[]>) => {
        this.proceduresTypes = res.data;
        return res;
      })
    );
  };

  addOrder() {
    const order = {
      ...this.addOrderForm.value,
      customerProcedureId:
        this.addOrderForm.value.customerProcedureId?.id || this.addOrderForm.value.customerProcedureId,
      customerId: this.addOrderForm.value.customerId?.id || this.addOrderForm.value.customerId,
      workerId: this.addOrderForm.value.workerId?.id || this.addOrderForm.value.workerId,
      visaCost: this.procedureTypeValue === 2 ? 0 : this.addOrderForm.value.visaCost,
      accommodationFee: this.procedureTypeValue === 2 ? 0 : this.addOrderForm.value.accommodationFee,
      workerSalary: this.procedureTypeValue === 2 ? 0 : this.addOrderForm.value.workerSalary,
      recruitAmount: this.procedureTypeValue === 2 ? 0 : this.addOrderForm.value.recruitAmount,
      customerRecruitAmount: this.procedureTypeValue === 2 ? 0 : this.addOrderForm.value.customerRecruitAmount,
    } as IRefund;

    order.recruitmentContractId = typeof order.recruitmentContractId == 'object' ? (order.recruitmentContractId as IEnum).id : order.recruitmentContractId;
    this.isLoading = true;
    this._refundService.addOrders(order).subscribe({
      next: () => {
        this.isLoading = false;
        this.addOrderForm.reset();
        this.returnWorkerData = null;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
