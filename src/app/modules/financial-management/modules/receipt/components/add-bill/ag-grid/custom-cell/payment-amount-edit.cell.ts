import { IRoleEnum } from 'src/app/core/constants';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { FormArray, FormBuilder } from '@angular/forms';
import { DialogPaymentAmountEditComponent } from '../../dialog/dialog-payment-amount-edit/dialog-payment-amount-edit.component';
import { DialogService } from 'src/app/core/services/dialog.service';
@Component({
  template: `
    <div class="actions-row-container">
      <button [matTooltip]="'tooltip.edit_payment_amount' | translate" mat-icon-button (click)="editPaymentAmount()">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
    </div>
  `,
})
export class PaymentAmountEditCell extends CoreBaseComponent implements ICellRendererAngularComp {
  public cell!: ICellRendererParams;
  public role = IRoleEnum.Job;

  constructor(@Inject(INJECTOR) injector: Injector, private _matDialog: DialogService, private _fb: FormBuilder) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.cell = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cell = params;
    return true;
  }

  editPaymentAmount() {
    this._matDialog
      .openDialog(DialogPaymentAmountEditComponent, {
        data: this.cell.data,
      })
      .subscribe(res => {
        if (res) {
          const index = (this.cell.context.parentComp.receiptFrom.get('services') as FormArray).value.findIndex(
            (r: { id: string | undefined }) => {
              return this.cell.data.id === r.id;
            }
          );
          (this.cell.context.parentComp.receiptFrom.get('services') as FormArray).at(index).patchValue({
            paymentAmount: res.paymentAmount,
          });
          this.cell.context.parentComp.gridApi
            .getRowNode(index)
            ?.setData((this.cell.context.parentComp.receiptFrom.get('services') as FormArray).value[index]);
          this.cell.context.parentComp.gridApi.applyTransaction({ update: [res] });
        }
      });
  }
}
