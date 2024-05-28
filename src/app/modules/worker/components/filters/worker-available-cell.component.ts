import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-worker-status',
  template: `
    <span *ngIf="cell.value">{{ 'available' | translate }}</span>
    <span *ngIf="!cell.value">{{ 'not_available' | translate }}</span>
  `,
})
export class WorkerAvailableCell implements ICellRendererAngularComp {
  cell!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.cell = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cell = params;
    return true;
  }
}
