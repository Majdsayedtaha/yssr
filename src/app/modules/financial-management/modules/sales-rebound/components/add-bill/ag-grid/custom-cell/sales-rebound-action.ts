import { IRoleEnum } from 'src/app/core/constants';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { FormArray } from '@angular/forms';
import { DialogSalesReboundComponent } from '../../dialog/dialog-sales-rebound/dialog-sales-rebound.component';
import { SalesReboundService } from '../../../../services/sales-rebound.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="more-actions-menu">
      <button mat-menu-item (click)="displayDetails()">
        <mat-icon color="primary" class="menu-item" svgIcon="rent"></mat-icon>
        <span>{{ 'display_details' | translate }}</span>
      </button>
      <button mat-menu-item>
        <mat-icon color="primary" class="menu-item" svgIcon="surety-transfer"></mat-icon>
        <span>{{ 'convert_service_refund' | translate }}</span>
      </button>
      <button mat-menu-item (click)="editSales()">
        <mat-icon color="primary" class="menu-item" svgIcon="edit-row"></mat-icon>
        <span>{{ 'edit_service' | translate }}</span>
      </button>
      <button mat-menu-item (click)="deleteSales()">
        <mat-icon color="primary" class="menu-item" svgIcon="delete-row"></mat-icon>
        <span>{{ 'delete_service' | translate }}</span>
      </button>
    </mat-menu>
  `,
  styles: [
    `
      ::ng-deep {
        [dir='rtl'] .mat-mdc-menu-item {
          flex-direction: row-reverse !important;
        }
        .mat-mdc-menu-item {
          min-height: 40px !important;
          font-size: 14px !important;
          border-bottom: 1px dashed var(--light-active-accent-color) !important;
          &:last-child {
            border-bottom: none !important;
          }
        }
        .mat-mdc-menu-item.mdc-list-item {
          .mat-icon path {
            fill: var(--primary-color) !important;
          }
        }
        .mat-mdc-menu-content {
          padding: 0 !important;
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
      }
      .menu-item {
        width: 16px;
        height: 16px;
        font-size: 14px;
      }
    `,
  ],
})
export class SalesReboundMoreActionsCell extends CoreBaseComponent implements ICellRendererAngularComp {
  public cell!: ICellRendererParams;
  public role = IRoleEnum.Job;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _matDialog: DialogService,
    private _salesReboundService: SalesReboundService
  ) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.cell = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cell = params;
    return true;
  }
  displayDetails() {
    this._salesReboundService.sideData.next(this.cell.data);
  }
  deleteSales() {
    this._salesReboundService
      .deleteReturnSales(this.cell.data.id)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.cell.context.parentComp.gridApi.applyTransaction({ remove: [this.cell.data] });
      });
  }

  editSales() {
    this._matDialog
      .openDialog(DialogSalesReboundComponent, {
        data: this.cell.data,
      })
      .subscribe(res => {
        if (res) {
          const index = (this.cell.context.parentComp.salesReboundFrom.get('services') as FormArray).value.findIndex(
            (r: { id: string | undefined }) => {
              return this.cell.data.id === r.id;
            }
          );
          (this.cell.context.parentComp.salesReboundFrom.get('services') as FormArray).at(index).patchValue({
            id: res.id,
            serviceName: res.serviceName,
            serviceNumber: res.serviceNumber,
            price: res.price,
            taxType: res.taxType,
            details: res.details,
            description: res.description,
            procedure: res.procedure,
          });
          this.cell.context.parentComp.gridApi
            .getRowNode(index)
            ?.setData((this.cell.context.parentComp.salesReboundFrom.get('services') as FormArray).value[index]);
          this.cell.context.parentComp.gridApi.applyTransaction({ update: [res] });
        }
      });
  }
}
