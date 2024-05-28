import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { ComplaintsService } from '../../services/complaints.service';
import { CustomerService } from 'src/app/modules/customers/services/customer.service';
import { switchMap } from 'rxjs';
import { ICustomerFormData } from 'src/app/modules/customers/models';
@UntilDestroy()
@Component({
  selector: 'app-dialog-complaints',
  templateUrl: './dialog-complaints.component.html',
  styleUrls: ['./dialog-complaints.component.scss'],
})
export class DialogComplaintsComponent extends CoreBaseComponent {
  public form!: FormGroup;
  public isGetCustomer: boolean = false;
  public customerDetails!: ICustomerFormData;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private _dialog: MatDialogRef<DialogComplaintsComponent>,
    private _fb: FormBuilder,
    private _complaintsService: ComplaintsService,
    private _customerService: CustomerService
  ) {
    super(injector);
  }

  //#region Life Cycle
  ngOnInit(): void {
    this.initialForm();
    if (this.editData.update) {
      this.form.patchValue({
        customerId: this.editData.data.customer,
        description: this.editData.data.description,
        suggestedSolution: this.editData.data.suggestedSolution,
        statusId: this.editData.data.status,
        solutionDays: this.editData.data.solutionDays,
        finalSolution: this.editData.data.finalSolution,
      });
    }
    this.watchCustomer();
  }
  //#end region

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      customerId: [null, Validators.required],
      description: [null, Validators.required],
      suggestedSolution: [null, Validators.required],
      statusId: [null, Validators.required],
      solutionDays: [null, Validators.required],
      finalSolution: [null, Validators.required],
    });
  }
  //#end region

  watchCustomer() {
    this.form
      .get('customerId')
      ?.valueChanges.pipe(
        switchMap(customerId => {
          this.isGetCustomer = true;
          return this._customerService.getCustomerDetails(customerId);
        })
      )
      .subscribe({
        next: res => {
          this.isGetCustomer = false;
          this.customerDetails = res.data as ICustomerFormData;
        },
        error: error => {
          this.isGetCustomer = false;
        },
        complete: () => {
          this.isGetCustomer = false;
        },
      });
  }

  submit() {
    if (this.editData.update === false) {
      this._complaintsService
        .addComplaints(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          this.closeDialog(res.data);
        });
    } else if (this.editData.update === true) {
      this._complaintsService
        .updateComplaints(this.editData.data.id, this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          this.closeDialog(res.data);
        });
    }
  }

  closeDialog(data: any) {
    this._dialog.close(data);
  }
  //#end region
}
