import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ICellRendererParams } from 'ag-grid-community';
import { UntypedFormGroup } from '@angular/forms';
import { DialogSalePriceComponent } from '../../dialog-sale-price/dialog-sale-price.component';
import { SalePriceService } from 'src/app/modules/settings/services/sale-price.service';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { DialogService } from 'src/app/core/services/dialog.service';
interface SalesPriceCellRendererAngularComp extends ICellRendererParams {
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
export class SalesPriceActionCell extends CoreBaseComponent implements ICellRendererAngularComp {
  public cell!: SalesPriceCellRendererAngularComp;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    public matDialog: DialogService,
    private _salesPriceService: SalePriceService,
    private _snackBar: NotifierService
  ) {
    super(injector);
  }

  agInit(params: SalesPriceCellRendererAngularComp): void {
    this.cell = params;
  }

  refresh(params: SalesPriceCellRendererAngularComp): boolean {
    this.cell = params;
    return true;
  }

  editSalesPrice() {
    this.cell.context.parentComp.update = true;
    this.cell.formGroup.get('priceData')?.patchValue({
      id: this.cell.data.id,
      experienceTypeId: this.cell.data.experienceType || this.cell.data.experienceTypeId,
      jobId: this.cell.data.job || this.cell.data.jobId,
      religionId: this.cell.data.religion || this.cell.data.religionId,
      // monthlySalary: this.cell.data.monthlySalary,
      price: this.cell.data.price,
    });
    const dialogRef = this.matDialog.openDialog(DialogSalePriceComponent, {
      data: { priceForm: this.cell.formGroup.get('priceData'), update: this.cell.context.parentComp.update },
      disableClose: false,
    });
    dialogRef.subscribe({
      next: res => {
        if (res) {
          if (!res.priceForm.value.id.includes('id_')) {
            const rowIndex = (this.cell.context.parentComp.pricesArray as FormArray).value.findIndex(
              (p: any) => p.id === res.priceForm.value.id
            );
            if (rowIndex !== -1) {
              const rowFormGroup = (this.cell.context.parentComp.pricesArray as FormArray).at(rowIndex);
              const pricesRow = res.priceForm.value;
              this.cell.data = {
                id: pricesRow.id,
                experienceType: pricesRow.experienceTypeId,
                job: pricesRow.jobId,
                religion: pricesRow.religionId,
                // monthlySalary: pricesRow.monthlySalary,
                price: pricesRow.price,
              };
              rowFormGroup.patchValue({
                id: pricesRow.id,
                experienceTypeId: pricesRow.experienceTypeId.id,
                jobId: pricesRow.jobId.id,
                religionId: pricesRow.religionId.id,
                // monthlySalary: +pricesRow.monthlySalary,
                price: +pricesRow.price,
              });
              this._salesPriceService.updateSalePrice(rowFormGroup.value.id, rowFormGroup.value).subscribe(() => {
                this.cell.api.applyTransaction({ update: [pricesRow] });
                this.applyActionsAfterEdit();
              });
            }
          } else {
            const rowIndex = (this.cell.context.parentComp.pricesArray as FormArray).value.findIndex(
              (p: any) => p.id === res.priceForm.value.id
            );
            if (rowIndex !== -1) {
              const rowFormGroup = (this.cell.context.parentComp.pricesArray as FormArray).at(rowIndex);
              rowFormGroup.setValue(res.priceForm.value);
              this.cell.api.applyTransaction({ update: [res.priceForm.value] });
              this.applyActionsAfterEdit();
            }
          }
        }
        this.cell.formGroup.get('priceData')?.reset({ id: 'id_' + crypto.randomUUID() });
      },
    });
  }

  deleteSalesPrice() {
    if (!this.cell.data.id.includes('id_')) {
      const rowIndex = (this.cell.context.parentComp.pricesArray as FormArray).value.findIndex(
        (p: any) => p.id === this.cell.data.id
      );
      if (rowIndex !== -1) {
        (this.cell.context.parentComp.pricesArray as FormArray).removeAt(rowIndex);
        this._salesPriceService.deleteSalePrices(this.cell.data.id).subscribe(() => {
          this.applyActionsAfterDelete();
        });
      }
    } else this.applyActionsAfterDelete();
  }

  applyActionsAfterDelete() {
    this.cell.api.applyTransaction({ remove: [this.cell.data] });
    this.cell.context.parentComp.takeCopy();
    this._snackBar.showNormalSnack(this.translateService.instant('toast.row_deleted_successfully'));
  }

  applyActionsAfterEdit() {
    this._snackBar.showNormalSnack(this.translateService.instant('toast.row_updated_successfully'));
  }
}
