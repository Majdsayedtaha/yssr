import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { AppRoutes } from 'src/app/core/constants';
import { PurchaseReturnService } from '../../../../services/Purchase-return.service';
@UntilDestroy()
@Component({
  selector: 'app-bills-more-actions',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="more-actions-menu">
      <button mat-menu-item (click)="updateBill()">
        <mat-icon color="primary" class="menu-item" svgIcon="pen"></mat-icon>
        <span>{{ 'table.bill.update_data_bill' | translate }}</span>
      </button>
      <button mat-menu-item (click)="deleteBill()">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'table.bill.delete_bill' | translate }}</span>
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
export class PurchasesReboundMoreActionsCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  constructor(@Inject(INJECTOR) injector: Injector, private _router: Router, private _purchaseReturnService: PurchaseReturnService) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }
  updateBill() {
    this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.financial}/purchases-rebound/update-bill/${this.params.data.id}`);
  }

  deleteBill() {
    this._purchaseReturnService.deletePurchaseReturn(this.params.data.id).subscribe(res => {
      this.params.context.parentComp.gridApi.applyTransaction({ remove: [this.params.data] });
    });
  }
}
