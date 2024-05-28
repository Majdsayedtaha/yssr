import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { UntypedFormGroup, FormArray } from '@angular/forms';
import { DialogRentPriceComponent } from '../../dialog-rent-price/dialog-rent-price.component';
import { RentPriceService } from 'src/app/modules/settings/services/rent-price.service';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { DialogService } from 'src/app/core/services/dialog.service';
interface RentPriceCellRendererAngularComp extends ICellRendererParams {
  formGroup: UntypedFormGroup;
}
@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="editRentalPrice()">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteRentalPrice()">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class RentalPriceActionCell extends CoreBaseComponent implements ICellRendererAngularComp {
  public cell!: RentPriceCellRendererAngularComp;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    public matDialog: DialogService,
    private _snackBar: NotifierService,
    private _rentPriceService: RentPriceService
  ) {
    super(injector);
  }

  agInit(params: RentPriceCellRendererAngularComp): void {
    this.cell = params;
  }

  refresh(params: RentPriceCellRendererAngularComp): boolean {
    this.cell = params;
    return true;
  }

  editRentalPrice() {
    this.cell.context.parentComp.update = true;
    this.cell.formGroup.get('priceData')?.patchValue({
      id: this.cell.data.id,
      rentTypeId: this.cell.data.rentType || this.cell.data.rentTypeId,
      price: this.cell.data.price,
    });
    const dialogRef = this.matDialog.openDialog(DialogRentPriceComponent, {
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
                rentType: pricesRow.rentTypeId,
                price: pricesRow.price,
              };
              rowFormGroup.patchValue({
                id: pricesRow.id,
                rentTypeId: pricesRow.rentTypeId.id,
                price: +pricesRow.price,
              });
              this._rentPriceService.updateRentPrice(rowFormGroup.value.id, rowFormGroup.value).subscribe(() => {
                this.cell.api.applyTransaction({ update: [pricesRow] });
                this.applyActionsAfterEdit();
              });
            }
          } else {
            this.cell.api.applyTransaction({ update: [res.priceForm.value] });
            this.applyActionsAfterEdit();
          }
        }
        this.cell.formGroup.get('priceData')?.reset({ id: 'id_' + crypto.randomUUID() });
      },
    });
  }

  deleteRentalPrice() {
    if (!this.cell.data.id.includes('id_'))
      this._rentPriceService.deleteRentPrices(this.cell.data.id).subscribe(() => {
        this.applyActionsAfterDelete();
      });
    else this.applyActionsAfterDelete();
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
