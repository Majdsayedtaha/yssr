import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, of, tap } from 'rxjs';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { DirectionService } from 'src/app/core/services/direction.service';
import { RefundService } from '../../services/refund.service';
import { IEnum } from 'src/app/core/interfaces';
import { IRefund, RefundProcedureTypeEnum } from '../../models';
import { IResponse } from 'src/app/core/models';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { TranslateService } from '@ngx-translate/core';
@UntilDestroy()
@Component({
  selector: 'app-add-procedure-form',
  templateUrl: './add-procedure-form.component.html',
  styleUrls: ['./add-procedure-form.component.scss'],
})
export class AddProcedureFormComponent extends CoreBaseComponent implements OnInit {
  public procedures!: IEnum[];
  public lastProcedures!: any[];
  public returnRequest!: IRefund | null;
  public addProcedureForm!: FormGroup;
  public procedureType = RefundProcedureTypeEnum;
  public selectedProcedure: IEnum | null = null;
  public isLoading: boolean = false;

  get f() {
    return this.addProcedureForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    public dir: DirectionService,
    @Inject(INJECTOR) injector: Injector,
    private _refundService: RefundService,
    private _notifierService: NotifierService,
    private _translateService: TranslateService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialForm();
    this.getLastProcedures();
    this.setupValidationFormGroups();
    this.watchControlTestPeriod();
    this.watchControlTestWorkerSalary();
    this.watchControlRefund();
    this.watchWorkerId();
  }

  watchWorkerId() {
    this.addProcedureForm
      .get('workerReturnRequestId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(() => {
        this.addProcedureForm.get('procedureId')?.patchValue(null);
      });
  }

  watchControlRefund() {
    this.addProcedureForm
      .get('refused')
      ?.get('refuseTestDays')
      ?.valueChanges?.pipe(untilDestroyed(this))
      .subscribe(value => {
        if (this.returnRequest) {
          let cost = (this.returnRequest.workerSalary / 30) * +value;
          let office = (this.returnRequest.testDailyCost || 0) * +value;
          this.addProcedureForm
            .get('refused')
            ?.get('refuseWorkerAmount')
            ?.patchValue(cost.toFixed(2), { emitEvent: false });
          this.addProcedureForm
            .get('refused')
            ?.get('externalOfficeAmount')
            ?.patchValue(office.toFixed(2), { emitEvent: false });
          this.addProcedureForm
            .get('refused')
            ?.get('refuseCustomerAmount')
            ?.patchValue((this.returnRequest.customerRecruitAmount - office - cost).toFixed(2), { emitEvent: false });
        }
      });
  }

  watchControlTestWorkerSalary() {
    this.addProcedureForm
      .get('experiment')
      ?.get('testCostDaily')
      ?.valueChanges?.pipe(untilDestroyed(this))
      .subscribe(value => {
        let period = this.addProcedureForm.get('experiment')?.get('testPeriodDays')?.value;
        let result = +period * +value;
        this.addProcedureForm
          .get('experiment')
          ?.get('testOfficeAmount')
          ?.patchValue(result.toFixed(2), { emitEvent: false });
      });
  }

  watchControlTestPeriod() {
    this.addProcedureForm
      .get('experiment')
      ?.get('testPeriodDays')
      ?.valueChanges?.pipe(untilDestroyed(this))
      .subscribe(value => {
        if (this.returnRequest) {
          let cost = (this.returnRequest.workerSalary / 30) * +value;
          this.addProcedureForm
            .get('experiment')
            ?.get('testWorkerSalary')
            ?.patchValue(cost.toFixed(2), { emitEvent: false });
        }
      });
  }

  initialForm() {
    this.addProcedureForm = this.fb.group({
      date: [null, Validators.required],
      workerReturnRequestId: [null, Validators.required],
      procedureId: [null, Validators.required],
      experiment: this.fb.group({
        // customerId: [null],
        testPeriodDays: [0],
        testCostDaily: [0],
        testWorkerSalary: [{ value: 0, disabled: true }],
        testOfficeAmount: [{ value: 0, disabled: true }],
        includingAccomodationAndTransferFees: [0],
        // testPeriodDays: [0, [Validators.min(0)]],
        // testWorkerSalary: [0, [Validators.min(0)]],
        // testCostDaily: [0, [Validators.min(0)]],
        // testOfficeAmount: [0, [Validators.min(0)]],
        // includingAccomodationAndTransferFees: [0, [Validators.min(0)]],
      }),
      finalExit: this.fb.group({
        finalExitReasonNote: [null],
      }),
      escaped: this.fb.group({
        escapeWorkerTypeId: [null],
        escapeWorkerReason: [null],
      }),
      refused: this.fb.group({
        refuseTestDays: [0],
        refuseWorkerAmount: [{ value: 0, disabled: true }],
        externalOfficeAmount: [{ value: 0, disabled: true }],
        refuseCustomerAmount: [{ value: 0, disabled: true }],
        // refuseTestDays: [0, [Validators.min(0)]],
        // refuseWorkerAmount: [0, [Validators.min(0)]],
        // externalOfficeAmount: [0, [Validators.min(0)]],
        // refuseCustomerAmount: [0, [Validators.min(0)]],
        refuseTypeWorker: [null],
      }),
      accept: this.fb.group({
        note: [null],
      }),
    });
  }

  setupValidationFormGroups() {
    this.addProcedureForm?.controls['procedureId'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((procedure: IEnum) => {
        if (!procedure?.value) return;
        this.selectedProcedure = procedure;

        const experimentValidation =
          procedure.value === this.procedureType.InExperiment ? Validators.required : Validators.nullValidator;
        const finalExitValidation =
          procedure.value === this.procedureType.FinalExit ? Validators.required : Validators.nullValidator;
        const escapedValidation =
          procedure.value === this.procedureType.WorkerEscaped ? Validators.required : Validators.nullValidator;
        const refuseFromExperiment =
          procedure.value === this.procedureType.RefuseFromExperiment ? Validators.required : Validators.nullValidator;
        const acceptValidation =
          procedure.value === this.procedureType.Accept ? Validators.required : Validators.nullValidator;


        this.updateValidation(
          this.getFormGroup('experiment'),
          Object.keys(this.getFormGroup('experiment').controls),
          experimentValidation
        );
        this.updateValidation(
          this.getFormGroup('finalExit'),
          Object.keys(this.getFormGroup('finalExit').controls),
          finalExitValidation
        );
        this.updateValidation(
          this.getFormGroup('escaped'),
          Object.keys(this.getFormGroup('escaped').controls),
          escapedValidation
        );
        this.updateValidation(
          this.getFormGroup('refused'),
          Object.keys(this.getFormGroup('refused').controls),
          refuseFromExperiment
        );
        this.updateValidation(
          this.getFormGroup('accept'),
          Object.keys(this.getFormGroup('accept').controls),
          acceptValidation
        );

        this.getFormGroup('experiment').reset();
        this.getFormGroup('finalExit').reset();
        this.getFormGroup('escaped').reset();
        this.getFormGroup('refused').reset();
        this.getFormGroup('accept').reset();
      });
  }

  fetchReturnRequestDetails(rentRequestId: string) {
    this._refundService
      .getOrderDetails(rentRequestId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: IResponse<IRefund>) => {
          this.returnRequest = response.data;
          // this.addProcedureForm.get('experiment')?.get('customerId')?.setValue(this.returnRequest.customer);
          this.fetchReturnProcedures(this.returnRequest.id).subscribe(
            (response: any) => (this.procedures = response.data)
          );
        },
      });
  }

  getLastProcedures() {
    this.addProcedureForm
      .get('workerReturnRequestId')
      ?.valueChanges.pipe(
        untilDestroyed(this),
        switchMap(value => {
          if (!value) {
            this.lastProcedures = [];
            return of([]);
          }
          this.fetchReturnRequestDetails(value);
          return this._refundService.getLastProcedures(value);
        })
      )
      .subscribe((res: any) => {
        this.lastProcedures = res.data;
      });
  }

  getFormGroup(name: string): FormGroup {
    return <FormGroup>this.addProcedureForm.get(name);
  }

  addProcedure() {
    if (this.addProcedureForm.valid) {
      const form = this.addProcedureForm.getRawValue();
      const formDTO = {
        ...this.getFormGroup('experiment').value,
        ...this.getFormGroup('finalExit').value,
        ...this.getFormGroup('escaped').value,
        ...this.getFormGroup('refused').value,
        ...this.getFormGroup('accept').value,
        date: form.date,
        workerReturnRequestId: form.workerReturnRequestId,
        procedureId: form.procedureId?.id || form.procedureId,
        // customerId: form.customerId?.id || form.customerId,
      };
      this.isLoading = true;
      this._refundService.addProcedure(formDTO).subscribe({
        next: res => {
          this.isLoading = false;
          this.addProcedureForm.reset({
            experiment: {
              // customerId: null,
              testPeriodDays: 0,
              testWorkerSalary: 0,
              testCostDaily: 0,
              testOfficeAmount: 0,
              includingAccomodationAndTransferFees: 0,
            },
            refused: {
              refuseTestDays: 0,
              refuseWorkerAmount: 0,
              externalOfficeAmount: 0,
              refuseCustomerAmount: 0,
              refuseTypeWorker: null,
            },
          });
          this.selectedProcedure = null;
          this.returnRequest = null;
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  fetchReturnProceduresFun = () => {
    return this.returnRequest?.id
      ? this.fetchReturnProcedures(this.returnRequest?.id).pipe(
        tap(res => {
          if (res.data.length === 0)
            this._notifierService.showNormalSnack(this._translateService.instant('request_has_been_locked'));
        })
      )
      : '';
  };
}
