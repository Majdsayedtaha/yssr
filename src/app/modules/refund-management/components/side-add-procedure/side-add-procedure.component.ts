import { IRefund, RefundProcedureTypeEnum } from '../../models';
import { IEnum } from 'src/app/core/interfaces';
import { IResponse } from 'src/app/core/models';
import { MatSidenav } from '@angular/material/sidenav';
import { RefundService } from '../../services/refund.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DirectionService } from 'src/app/core/services/direction.service';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { tap } from 'rxjs';
import { NotifierService } from 'src/app/core/services/notifier.service';

@UntilDestroy()
@Component({
  selector: 'side-add-procedure',
  templateUrl: './side-add-procedure.component.html',
  styleUrls: ['./side-add-procedure.component.scss'],
})
export class SideAddProcedureComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  //Decorators
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;
  //Properties
  returnRequest!: IRefund;
  stateUpdate!: any;
  isLoading: boolean = false;
  addProcedureForm!: FormGroup;
  selectedProcedure: IEnum | null = null;
  procedureType = RefundProcedureTypeEnum;
  update = false;
  formDTO!: any;
  getFormGroup(name: string): FormGroup {
    return <FormGroup>this.addProcedureForm.get(name);
  }

  constructor(
    private fb: FormBuilder,
    public dir: DirectionService,
    private _refundService: RefundService,
    private _notifierService: NotifierService,
    @Inject(INJECTOR) injector: Injector
  ) {
    super(injector);
  }

  initialForm() {
    this.addProcedureForm = this.fb.group({
      id: [null],
      date: [null, Validators.required],
      workerReturnRequestId: [null, Validators.required],
      procedureId: [null, Validators.required],
      experiment: this.fb.group({
        // customerId: [null, Validators.required],
        testPeriodDays: [0],
        testCostDaily: [0],
        testWorkerSalary: [{ value: 0, disabled: true }],
        testOfficeAmount: [{ value: 0, disabled: true }],
        includingAccomodationAndTransferFees: [0],
      }),
      finalExit: this.fb.group({
        finalExitReasonNote: [null],
      }),
      escaped: this.fb.group({
        escapeWorkerTypeId: [null, Validators.required],
        escapeWorkerReason: [null, Validators.required],
      }),
      refused: this.fb.group({
        refuseTestDays: [0],
        refuseWorkerAmount: [{ value: 0, disabled: true }],
        externalOfficeAmount: [{ value: 0, disabled: true }],
        refuseCustomerAmount: [{ value: 0, disabled: true }],
        refuseTypeWorker: [null],
      }),
      accept: this.fb.group({
        note: [null],
      }),
    });
  }

  //#region Watch Form Changes

  watchFormChangesData() {
    this.setupValidationFormGroups();
    this.watchControlRefund();
    this.watchControlTestWorkerSalary();
    this.watchControlTestPeriod();
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
        // const returnValidation =
        //   procedure.value === this.procedureType.Return ? Validators.required : Validators.nullValidator;

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
  //#endregion

  // #region Fetch Data
  fetchReturnRequestDetails(rentRequestId: string) {
    this._refundService
      .getOrderDetails(rentRequestId)
      .pipe(untilDestroyed(this))
      .subscribe((response: IResponse<IRefund>) => {
        this.returnRequest = response.data;
        this.addProcedureForm.controls['workerReturnRequestId'].setValue(this.returnRequest.id);
      });
  }

  fetchReturnProceduresFun = () => {
    return this.returnRequest?.id
      ? this.fetchReturnProcedures(this.returnRequest?.id).pipe(
          tap(res => {
            if (res.data.length === 0)
              this._notifierService.showNormalSnack(this.translateService.instant('request_has_been_locked'));
          })
        )
      : false;
  };
  //#endregion

  //#region Submit
  submit() {
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
        customerId: form.customerId?.id || form.customerId,
        id: this.stateUpdate.procedure ? this.stateUpdate.procedure.id : null,
      };
      this.isLoading = true;
      this._refundService.addProcedure(formDTO).subscribe({
        next: () => {
          this.isLoading = false;
          this.selectedProcedure = null;
          this.close();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }
  //#endregion

  //#region Sidebar

  checkIfNeedToOpen() {
    this.refundService.sideAddProcedure.pipe(untilDestroyed(this)).subscribe(data => {
      if (data?.id) {
        this.stateUpdate = data;
        this.sidenav.open();
        this.fetchReturnRequestDetails(data.id);
      }
      if (data?.contractInfo?.id) {
        this.stateUpdate = data;
        this.sidenav.open();
        this.fetchReturnRequestDetails(data.contractInfo.id);
      }
    });
  }

  close() {
    this.sidenav.close();
    this._refundService.sideAddProcedure.next(null);
  }
  // #endregion

  //#region Life Cycle Hooks
  ngOnInit(): void {
    this.initialForm();
    this.checkIfNeedToOpen();
    this.watchFormChangesData();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.refundService.sideAddProcedure.next(null);
  }

  //#endregion
}
