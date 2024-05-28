import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { UntypedFormGroup } from '@angular/forms';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { DialogAgreementPriceComponent } from '../../dialog-agreement-price/dialog-agreement-price.component';
import { DialogService } from 'src/app/core/services/dialog.service';

interface AgreementPriceCellRendererAngularComp extends ICellRendererParams {
  formGroup: UntypedFormGroup;
}

@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="editSalesPrice()">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteSalesPrice()">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class AgreementPriceActionCell extends CoreBaseComponent implements ICellRendererAngularComp {
  public cell!: AgreementPriceCellRendererAngularComp;

  constructor(@Inject(INJECTOR) injector: Injector, public matDialog: DialogService) {
    super(injector);
  }

  agInit(params: AgreementPriceCellRendererAngularComp): void {
    this.cell = params;
  }

  refresh(params: AgreementPriceCellRendererAngularComp): boolean {
    this.cell = params;
    return true;
  }

  editSalesPrice() {
    this.cell.context.parentComp.update = true;
    this.cell.formGroup?.patchValue(
      {
        id: this.cell.data.id,
        experienceTypeId: this.cell.data.experienceType || this.cell.data.experienceTypeId,
        jobId: this.cell.data.job || this.cell.data.jobId,
        religionId: this.cell.data.religion || this.cell.data.religionId,
        recruitmentPeriod: this.cell.data.recruitmentPeriod,
        agreementPrice: this.cell.data.agreementPrice,
      },
      { emitEvent: false }
    );
    const dialogRef = this.matDialog.openDialog(DialogAgreementPriceComponent, {
      data: { priceForm: this.cell.formGroup, update: this.cell.context.parentComp.update },
      disableClose: false,
    });
    dialogRef.subscribe({
      next: res => {
        if (res && res.update) {
          const data = { ...this.cell.data, ...res.priceForm.value };
          console.log(data);
          this.cell.api.applyTransaction({ update: [data] });
          const index = this.cell.context.parentComp.rowData.findIndex((el: any) => el.id == this.cell.data.id);
          this.cell.context.parentComp.rowData[index] = data;
        }
      },
    });
  }

  deleteSalesPrice() {
    this.applyActionsAfterDelete();
  }

  applyActionsAfterDelete() {
    this.cell.api.applyTransaction({ remove: [this.cell.data] });
    const idxFind = this.cell.context.parentComp.rowData.find((el: any) => el.id == this.cell.data.id);
    this.cell.context.parentComp.rowData.splice(idxFind, 1);
  }
}
