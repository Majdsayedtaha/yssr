import { IRoleEnum } from 'src/app/core/constants';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { DialogServiceFormComponent } from '../../dialog/dialog-service-form/dialog-service-form.component';
import { FormArray } from '@angular/forms';
import { DialogService } from 'src/app/core/services/dialog.service';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="editSales()">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteSales()">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class SalesMoreActionsCell extends CoreBaseComponent implements ICellRendererAngularComp {
  public cell!: ICellRendererParams;
  public role = IRoleEnum.Job;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _matDialog: DialogService,
  ) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.cell = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cell = params;
    return true;
  }

  deleteSales() {
    this.cell.context.parentComp.gridApi.applyTransaction({ remove: [this.cell.data] })
  }

  editSales() {
    this._matDialog
      .openDialog(DialogServiceFormComponent, {
        data: this.cell.data,
      })
      .subscribe(res => {
        if (res) {
          const index = (this.cell.context.parentComp.salesFrom.get('services') as FormArray).value.findIndex(
            (r: { id: string | undefined }) => {
              return this.cell.data.id === r.id;
            }
          );
          (this.cell.context.parentComp.salesFrom.get('services') as FormArray).at(index).patchValue({
            id: res.id,
            details: res.details,
            description: res.description,
            serviceMain: res.serviceMain,
            serviceName: res.serviceName,
            serviceNumber: res.serviceNumber,
            accountNumber: res.accountNumber,
            contractAmount: res.contractAmount,
            taxType: res.taxType,
            totalWithoutTax: res.totalWithoutTax,
            totalWithTax: res.totalWithTax,
            discount: res.discount,
            taxAmount: res.taxAmount,
          });
          this.cell.context.parentComp.gridApi
            .getRowNode(index)
            ?.setData((this.cell.context.parentComp.salesFrom.get('services') as FormArray).value[index]);
          this.cell.context.parentComp.gridApi.applyTransaction({ update: [res] });
          this.cell.context.parentComp.gridApi.refreshCells({ force: true });
        }
      });
  }
}
