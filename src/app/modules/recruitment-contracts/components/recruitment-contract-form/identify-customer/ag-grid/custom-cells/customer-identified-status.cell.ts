import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-contracts-status',
  template: `
    <span class="green-status" *ngIf="params.value === false"> {{ 'active' | translate }} </span>
    <span class="red-status" *ngIf="params.value === true"> {{ 'block' | translate }} </span>
  `,
  styles: [``],
})
export class CustomerIdentifiedStatusCell implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }
}
