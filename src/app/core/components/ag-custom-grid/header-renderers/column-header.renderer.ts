import { Subscription } from 'rxjs';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { IHeaderParams } from 'ag-grid-community';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FilterTemplate } from '../cell-renderers/filter-template.renderer';
import { HelperFunctionsService } from 'src/app/core/services/helper-functions.service';

@Component({
  selector: 'ag-filter-radio',
  template: `
    <div *ngIf="filterObj && !pinned" class="column-header">
      <div #menuButton class="customHeaderMenuButton" (click)="onMenuClicked()">
        <mat-icon
          *ngIf="enableFilterAndSortOfTable"
          [svgIcon]="
            (!params?.context?.parentComp?.filterObj[field] &&
              params?.context?.parentComp?.filterObj[field] !== false) ||
            params?.context?.parentComp?.filterObj[field]?.from === '' ||
            params?.context?.parentComp?.filterObj[field]?.to === '' ||
            params?.context?.parentComp?.filterObj[field]?.from === null ||
            params?.context?.parentComp?.filterObj[field]?.to === null
              ? 'filter'
              : 'filter-fill'
          ">
        </mat-icon>
      </div>
      <div class="customHeaderLabel">{{ params.displayName }}</div>
      <div *ngIf="!stopSort && params.context?.parentComp && enableFilterAndSortOfTable">
        <div
          (click)="onSortRequested('desc')"
          class="customSortRemoveLabel"
          *ngIf="!sortState || !filterObj['sort'][field]">
          <mat-icon svgIcon="sort_default" style="width: 1rem !important"></mat-icon>
        </div>
        <div
          (click)="onSortRequested('asc')"
          class="customSortDownLabel"
          *ngIf="sortState === 'desc' && filterObj['sort'][field]">
          <mat-icon svgIcon="asc" style="width: 1rem !important"></mat-icon>
        </div>
        <div
          (click)="onSortRequested('')"
          class="customSortUpLabel"
          *ngIf="sortState === 'asc' && filterObj['sort'][field]">
          <mat-icon svgIcon="desc" style="width: 1rem !important"></mat-icon>
        </div>
      </div>
    </div>
    <!-- More Actions Header -->
    <div *ngIf="pinned && params.context?.parentComp && enableFilterAndSortOfTable">
      <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
        <mat-icon svgIcon="table-more-action"></mat-icon>
      </button>
      <mat-menu #menu="matMenu" class="more-actions-menu">
        <button mat-menu-item (click)="getCsvData()">
          <mat-icon svgIcon="export-excel" class="customHeaderLabel menu-item"></mat-icon>
          <span>{{ 'export_csv' | translate }}</span>
        </button>
        <button mat-menu-item (click)="reset()">
          <mat-icon svgIcon="reset-options" class="customHeaderLabel menu-item"></mat-icon>
          <span>{{ 'reset_filtering' | translate }}</span>
        </button>
      </mat-menu>
    </div>
  `,
  styles: [
    `
      .customHeaderMenuButton,
      .customHeaderLabel,
      .customSortDownLabel,
      .customSortUpLabel,
      .customSortRemoveLabel {
        float: left;
        margin: 0 0 0 0.25rem;
        cursor: pointer;
        height: 20px;
      }

      .column-header {
        display: flex;
        .mat-icon {
          height: 20px !important;
          width: 20px !important;
        }
      }

      .more-btn {
        cursor: pointer;
        width: 30px;
        height: 30px;
        padding: 3px;
        padding-top: 4px;
        .mat-icon {
          scale: 0.7;
        }
        &::ng-deep path {
          fill: white !important;
        }
      }

      .menu-item {
        margin: 0.5rem !important;
        width: 16px;
        height: 16px;
        font-size: 14px;
      }
    `,
  ],
})
export class HeaderRenderer extends FilterTemplate implements IHeaderAngularComp {
  @ViewChild('menuButton', { read: ElementRef }) public menuButton: any;
  sortState: string = '';
  stopSort: boolean = false;
  filterObj: any = {};
  sub2?: Subscription;
  pinned: boolean = false;
  csvData: any[] = [];
  headersCSV: string[] = [];
  enableFilterAndSortOfTable!: boolean;
  parent!: any;

  constructor(public helperFunctionService: HelperFunctionsService) {
    super();
  }

  agInit(params: any): void {
    this.stopSort = params.stopSort;
    this.pinned = params.column.isPinned();
    this.params = params;
    this.field = this.params.column.getColDef().field || '';
    this.parent = params.context?.parentComp;
    if (this.parent) {
      // this.filterObj = this.parent?.filterObj;
      // this.filterOb = {};
      this.parent.filterObj ? (this.parent.filterObj = { ...this.filterObj, sort: {} }) : '';
      this.enableFilterAndSortOfTable =
        typeof this.parent?.enableFilterAndSortOfTable === 'boolean' ? this.parent?.enableFilterAndSortOfTable : true;
    }
  }

  async getCsvData() {
    const processedData = await this.parent.fetchingForExport().toPromise();
    this.headersCSV = this.parent.headersCSV;
    this.exportToCSV(processedData, this.headersCSV);
  }

  exportToCSV(dataToExport: any[], headerCSV: string[]) {
    const title: string = document.title.trim();
    const date = this.helperFunctionService.formatDate(new Date(), true).trim();
    const fileName = [date, title].join('').replaceAll('-', '').replaceAll('_', '');
    new ngxCsv(dataToExport, fileName, { headers: headerCSV, showLabels: true });
  }

  refresh(params: IHeaderParams<any, any>): boolean {
    return true;
  }

  onMenuClicked() {
    this.params.showColumnMenu(this.menuButton.nativeElement);
  }

  onSortRequested(order: string) {
    this.sortState = order;
    this.filterObj['sort'] = {};
    this.parent.filterObj['sort'] = {};

    if (order) {
      this.filterObj['sort'][this.field] = order;
      this.parent.filterObj['sort'][this.field] = order;
    }

    this.parent?.getList()?.subscribe();
  }

  reset() {
    this.parent.filterObj = this.filterObj = {};
    this.parent.getList().subscribe();
    this.parent.filterService?.clearFilter?.next(true);
  }
}
