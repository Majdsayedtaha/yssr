import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { AppRoutes } from 'src/app/core/constants';
import { IRefundStatistics } from 'src/app/modules/refund-management/models';
import { RefundService } from 'src/app/modules/refund-management/services/refund.service';

@Component({
  selector: 'app-orders-more-actions',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="more-actions-menu">
      <button mat-menu-item (click)="displayOrderDetails()">
        <mat-icon color="primary" class="menu-item" svgIcon="personal-data"></mat-icon>
        <span>{{ 'refund.table.cell.display_details_order' | translate }}</span>
      </button>
      <button mat-menu-item (click)="editOrder()">
        <mat-icon color="primary" class="menu-item" svgIcon="pen"></mat-icon>
        <span>{{ 'refund.table.cell.update_data_order' | translate }}</span>
      </button>
      <button mat-menu-item (click)="deleteOrder()">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'refund.table.cell.delete_order' | translate }}</span>
      </button>
      <button mat-menu-item (click)="displaySideAddProcedure()">
        <mat-icon color="primary" class="menu-item" svgIcon="add-action"></mat-icon>
        <span>{{ 'refund.table.cell.add_procedure' | translate }}</span>
      </button>
      <button mat-menu-item>
        <mat-icon color="primary" class="menu-item" svgIcon="list-numbers"></mat-icon>
        <span>{{ 'refund.table.cell.hold_experiment' | translate }}</span>
      </button>
      <button mat-menu-item (click)="displaySideContractProcedures()">
        <mat-icon color="primary" class="menu-item" svgIcon="audit"></mat-icon>
        <span>{{ 'action_log' | translate }}</span>
      </button>
      <button mat-menu-item [matMenuTriggerFor]="printMenu">
        <mat-icon color="primary" class="menu-item" svgIcon="print"></mat-icon>
        <span>{{ 'refund.table.cell.print' | translate }}</span>
      </button>
    </mat-menu>
    <mat-menu #printMenu="matMenu" class="more-actions-menu">
      <button mat-menu-item>
        <span>{{ 'refund.table.cell.employment_contract' | translate }}</span>
      </button>
      <button mat-menu-item>
        <span>{{ 'refund.table.cell.employment_receipt' | translate }}</span>
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
export class OrdersMoreActionsCell implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  constructor(private _refundService: RefundService, private _router: Router) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  editOrder() {
    this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.refund}/edit-order/${this.params.data.id}`);
  }

  displayOrderDetails() {
    this._refundService.sideOrderDetails.next(this.params.data);
  }

  displaySideAddProcedure() {
    this._refundService.sideAddProcedure.next(this.params.data);
  }

  deleteOrder() {
    this._refundService.deleteOrders(this.params.data.id).subscribe(res => {
      this.params.api.applyTransaction({ remove: [this.params.data] });
      this._refundService.updateStatistics.next(<IRefundStatistics>(<unknown>res?.data));
    });
  }

  displaySideContractProcedures() {
    this._refundService.sideLogProcedure.next(this.params.data);
  }
}
