import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'filter-date-show',
  template: ` <span>{{ params.value | timezoneToDate }}</span> `,
})
export class DateShowRenderer {
  params!: ICellRendererParams;

  constructor() {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }
}
