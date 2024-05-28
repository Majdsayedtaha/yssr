import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IToastData, ToastComponent } from 'src/app/core/components/toast/toast.component';
import { of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/core/constants';
import { SuretyTransferService } from '../../../../services/surety-transfer.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'surety-transfer-completed-more-actions',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="more-actions-menu">
      <button mat-menu-item (click)="viewWaiverRequestDetails()">
        <mat-icon color="primary" class="menu-item" svgIcon="contract"></mat-icon>
        <span>{{ 'view_details' | translate }}</span>
      </button>
      <button mat-menu-item (click)="openUpdateContract()">
        <mat-icon color="primary" class="menu-item" svgIcon="pen"></mat-icon>
        <span>{{ 'update_request' | translate }}</span>
      </button>
      <button mat-menu-item (click)="deleteRequestConfirmation()">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'delete_request' | translate }}</span>
      </button>
      <button mat-menu-item>
        <mat-icon color="primary" class="menu-item" svgIcon="print"></mat-icon>
        <span>{{ 'print' | translate }}</span>
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
export class CompletedOrdersMoreActionsCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _suretyTransferService: SuretyTransferService,
    private _toast: DialogService,
    private _router: Router
  ) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }
  viewWaiverRequestDetails() {
    this._suretyTransferService.orderId.next(this.params.data.id);
  }
  openUpdateContract() {
    this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.suretyTransfer}/update-order/${this.params.data.id}`);
  }

  deleteRequestConfirmation() {
    const toastData: IToastData = {
      messageContent: 'you_want_to_delete_request',
      firstButtonContent: 'back_table',
      secondButtonContent: 'yes_surely',
      svgIcon: 'laptop-toast',
      centralize: true,
    };
    this._toast
      .openDialog(ToastComponent, { data: toastData })
      .pipe(
        switchMap(res => {
          if (res) {
            return this._suretyTransferService.deleteRequest(this.params.data.id);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(res => {
        if (res) {
          this.params.api.applyTransaction({ remove: [this.params.data] });
          this.params.context?.parentComp?.getWaiverRequestsList();
        }
      });
  }
}
