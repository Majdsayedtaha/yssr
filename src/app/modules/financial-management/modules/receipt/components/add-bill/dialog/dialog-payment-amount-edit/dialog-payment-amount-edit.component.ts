import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

@Component({
  selector: 'app-dialog-payment-amount-edit',
  templateUrl: './dialog-payment-amount-edit.component.html',
  styleUrls: ['./dialog-payment-amount-edit.component.scss'],
})
export class DialogPaymentAmountEditComponent extends CoreBaseComponent {
  public form!: FormGroup;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private _dialog: MatDialogRef<DialogPaymentAmountEditComponent>,
    private _fb: FormBuilder
  ) {
    super(injector);
  }

  //#region Life Cycle
  ngOnInit(): void {
    this.initialForm();
    this.form.patchValue({
      paymentAmount: this.editData.paymentAmount,
    });
  }
  //#end region

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      id: [null],
      paymentAmount: [null, Validators.required],
    });
  }
  //#end region

  submit() {
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   this.form.updateValueAndValidity();
    // }

    // if (this.form.valid) {

    this.form.get('id')?.setValue(this.editData.id);
    this.editData = { ...this.form.value, id: this.editData.id };
    this._dialog.close(this.editData);
    // }
  }

  closeDialog() {
    this._dialog.close(null);
  }
  //#end region
}
