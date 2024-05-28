import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-linked-to-resume-contracts',
  template: `
    <span class="green-status" *ngIf="params.data.isExtend"> {{ 'extended' | translate }} </span>
    <span class="red-status" *ngIf="params.data.isEnd"> {{ 'finished' | translate }} </span>
    <span class="yellow-status" *ngIf="!params.data.isEnd && !params.data.isExtend "> {{ 'in_progress' | translate }} </span>
  `,
  styles: [``],
})
export class WarrantyStateContractsCell implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }
}
