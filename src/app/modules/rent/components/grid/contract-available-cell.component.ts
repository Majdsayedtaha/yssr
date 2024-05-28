import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-worker-status',
  template: `
    <span *ngIf="cell.value">{{ 'expired' | translate }}</span>
    <span *ngIf="!cell.value">{{ 'not_expired' | translate }}</span>
  `,
})
export class ContractAvailableCell implements ICellRendererAngularComp {
  cell!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.cell = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cell = params;
    return true;
  }
}
