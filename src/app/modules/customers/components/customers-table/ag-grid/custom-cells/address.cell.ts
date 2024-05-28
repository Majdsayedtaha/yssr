import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-customers-address',
  template: `
    <span [matTooltip]="params.data.country + ' - ' + params.data.city + ' - ' + params.data.street">
      {{ params.data.country }}
    </span>
  `,
  styles: [
    `
      .active-status {
        background-color: #b3edb3;
        width: fit-content;
        padding: 3px 5px;
        border-radius: 5px;
        color: #38db68;
      }
      .blocked-status {
        background-color: #fc8d8d;
        width: fit-content;
        padding: 3px 5px;
        border-radius: 5px;
        color: #f93c2e;
      }
    `,
  ],
})
export class CustomersAddressCell implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  constructor() {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }
}
