import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { AppRoutes } from 'src/app/core/constants';
import { DialogService } from 'src/app/core/services/dialog.service';
import { PurchaseService } from '../../../../services/purchases.service';
import { IToastData, ToastComponent } from 'src/app/core/components/toast/toast.component';
import { of, switchMap } from 'rxjs';
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
export class PurchasesMoreActionsCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  constructor(@Inject(INJECTOR) injector: Injector, private _router: Router,  private _toast: DialogService,
  private _purchaseService: PurchaseService) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }
  updateBill() {
    this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.financial}/purchases/update-bill/${this.params.data.id}`);
  }

  deleteBill() {
    const toastData: IToastData = {
      messageContent: 'you_want_to_delete_bill',
      firstButtonContent: 'back_table',
      secondButtonContent: 'yes_surely',
      svgIcon: 'laptop-toast',
      centralize: true,
    };
    this._toast
      .openDialog(ToastComponent, {
        data: toastData,
      })
      .pipe(
        untilDestroyed(this),
        switchMap(res => (res ? this._purchaseService.deletePurchase(this.params.data.id) : of(null)))
      )
      .subscribe(res => {
        if (res) {
          this.params.api.applyTransaction({ remove: [this.params.data] });
        }
      });
  }
}
