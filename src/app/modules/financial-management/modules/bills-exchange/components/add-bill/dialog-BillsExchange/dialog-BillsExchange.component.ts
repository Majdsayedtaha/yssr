import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { of } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-dialog-BillsExchange',
  templateUrl: './dialog-BillsExchange.component.html',
  styleUrls: ['./dialog-BillsExchange.component.scss'],
})
export class DialogBillsExchangeComponent extends CoreBaseComponent {
  public form!: FormGroup;
  public editMode: boolean = false;
  typeSideDisplay!: number;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    @Inject(MAT_DIALOG_DATA) public editExchangeBillData: any,
    private _dialog: MatDialogRef<DialogBillsExchangeComponent>,
    private _fb: FormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialForm();
    if (this.editExchangeBillData) {
      this.editMode = true;
      console.log(this.editExchangeBillData);
      setTimeout(() => {
        this.form.patchValue({
          id: this.editExchangeBillData?.id,
          sideTypeId: this.editExchangeBillData?.sideTypeId,
          expenseTypeId: this.editExchangeBillData?.expenseTypeId,
          taxTypeId: this.editExchangeBillData?.taxTypeId,
          amount: this.editExchangeBillData?.amount,
          description: this.editExchangeBillData?.description,
          customerId: this.editExchangeBillData?.customerId,
          employeeId: this.editExchangeBillData?.employeeId,
          officeId: this.editExchangeBillData?.officeId,
          accountId: this.editExchangeBillData?.accountId,
          contractId: this.editExchangeBillData?.accountId,
        });
      }, 0);
    }
    this.sideType();
    this.onChangeOffice();
  }

  initialForm() {
    this.form = this._fb.group({
      id: [null],
      sideTypeId: [null, Validators.required],
      expenseTypeId: [null, Validators.required],
      taxTypeId: [null, Validators.required],
      amount: [null, Validators.required],
      description: [null, Validators.required],
      customerId: [null],
      employeeId: [null],
      officeId: [null],
      accountId: [null],
      contractId: [null],
    });
  }

  sideType() {
    this.form.get('sideTypeId')?.valueChanges.subscribe(data => {
      if (data) {
        this.typeSideDisplay = data.value;
      }
    });
  }
  onChangeOffice() {
    this.form
      .get('officeId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(value => {
        this.form.get('contractId')?.reset(null);
      });
  }
  getOfficeContract = (value?: string, page?: number) => {
    const externalOfficeId = this.form.get('officeId')?.value;
    console.log(externalOfficeId);
    if (externalOfficeId) return this.getContractsForExchange(externalOfficeId, value, page);
    else return of([]);
  };

  submit() {
    if (this.editMode) {
      //Edit Mode
      this.form.get('id')?.setValue(this.editExchangeBillData.id);
      this.editExchangeBillData = { ...this.form.getRawValue(), id: this.editExchangeBillData.id };
      this._dialog.close(this.editExchangeBillData);
    } else {
      //Add Mode
      this.form.get('id')?.setValue(crypto.randomUUID());
      this._dialog.close(this.form.getRawValue());
    }
  }

  closeDialog() {
    this._dialog.close(null);
  }
}
