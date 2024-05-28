import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-customers-status',
  template: `
    <span class="green-status" *ngIf="params.data.isBlocked === false"> {{ 'active' | translate }} </span>
    <span class="red-status" *ngIf="params.data.isBlocked === true"> {{ 'block' | translate }} </span>
  `,
  styles: [``],
})
export class CustomersStatusCell implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }
}
