import { Component } from '@angular/core';
import { IHeaderAngularComp, IFilterAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-header-icon',
  template: `
    <div (click)="onFilterClick()">
      <mat-icon class="header-icon" svgIcon="header-table-icon"></mat-icon>
    </div>
    <span>{{ params.displayName }}</span>
  `,
  styles: [
    `
      .header-icon {
        width: 12px;
        height: 12px;
      }
    `,
  ],
})
export class HeaderIconComponent implements IHeaderAngularComp, IFilterAngularComp {
  private value: any;
  params: any;

  isFilterActive(): boolean {
    return this.value !== null && this.value !== undefined;
  }

  doesFilterPass(params: any): boolean {
    return true;
  }

  getModel(): any {
    return { value: this.value };
  }

  setModel(model: any): void {
    this.value = model.value;
  }

  onFilterClick(): void {
    this.params.filterOpened();
  }

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }
}
