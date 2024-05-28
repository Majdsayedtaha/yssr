import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

@Component({
  selector: 'app-dialog-sales-rebound',
  templateUrl: './dialog-sales-rebound.component.html',
  styleUrls: ['./dialog-sales-rebound.component.scss'],
})
export class DialogSalesReboundComponent extends CoreBaseComponent {
  public form!: FormGroup;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    @Inject(MAT_DIALOG_DATA) public editServiceData: any,
    private _dialog: MatDialogRef<DialogSalesReboundComponent>,
    private _fb: FormBuilder
  ) {
    super(injector);
  }

  //#region Life Cycle
  ngOnInit(): void {
    this.initialForm();
    if (this.editServiceData) {
      this.form.patchValue({
        id: this.editServiceData.id,
        serviceName: this.editServiceData.serviceName,
        serviceNumber: this.editServiceData.serviceNumber,
        price: this.editServiceData.price,
        taxType: this.editServiceData.taxType,
        details: this.editServiceData.details,
        description: this.editServiceData.description,
      });
    }
  }
  //#end region

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      id: [null],
      serviceName: [null, Validators.required],
      serviceNumber: [null, Validators.required],
      price: [null],
      taxType: [null],
      details: [null],
      description: [null],
    });
  }
  //#end region

  submit() {
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   this.form.updateValueAndValidity();
    // }

    // if (this.form.valid) {
      //Edit Mode
      this.form.get('id')?.setValue(this.editServiceData.id);
      this.editServiceData = { ...this.form.value, id: this.editServiceData.id };
      this._dialog.close(this.editServiceData);
    // }
  }

  closeDialog() {
    this._dialog.close(null);
  }
  //#end region
}
