import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormControl } from '@angular/forms';
import { PurchaseService } from '../../../services/purchases.service';

@UntilDestroy()
@Component({
  template: `
    <div class="actions-row-container">
      <input
        mask="separator.2"
        thousandSeparator=","
        class="input-cell"
        autocomplete="off"
        dir="ltr"
        matInput
        type="text"
        min="0"
        [formControl]="amountControl"
        [ngStyle]="{
          'background-color': amountControl.value ? '#3f51b580' : 'initial',
          color: amountControl.value ? 'var(--white)' : 'initial'
        }" />
    </div>
  `,
  styles: [
    `
      .input-cell {
        width: 130px;
        height: 30px;
        border: 2px solid;
        outline: none;
        border-color: var(--ag-input-border-color);
        border-radius: 4px;
        font-family: 'Tajawal';
      }
    `,
  ],
})
export class reboundAmountCell implements ICellRendererAngularComp {
  cell!: ICellRendererParams;
  amountControl = new FormControl<number>(0);

  constructor(private _purchaseService: PurchaseService) {}

  agInit(params: ICellRendererParams): void {
    this.cell = params;
    this.watchContractAmountChanges();
  }

  refresh(params: ICellRendererParams): boolean {
    this.cell = params;
    return true;
  }

  watchContractAmountChanges() {
    if (this.cell.value > 0) {
      this.amountControl.setValue(this.cell.value, { emitEvent: false });
    }

    this.amountControl?.valueChanges.pipe(untilDestroyed(this)).subscribe(v => {
      this.cell.value = v;
      this.cell.data.refundAmount = v;
      const contracts = this._purchaseService.officeContracts;
      const contractIndex = contracts.findIndex(contract => contract.id === this.cell.data.id);

      if (typeof v === 'number') {
        if (v > 0) {
          contractIndex > -1 ? (contracts[contractIndex] = this.cell.data) : contracts.push(this.cell.data);
        } else {
          this.amountControl.reset(0, { emitEvent: false });
          contractIndex > -1 ? contracts.splice(contractIndex, 1) : '';
        }
      } else {
        this.amountControl.reset(0, { emitEvent: false });
        contractIndex > -1 ? contracts.splice(contractIndex, 1) : '';
      }
    });
  }
}
