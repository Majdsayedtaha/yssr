import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CustomerService } from '../../../../services/customer.service';
import { IToastData, ToastComponent } from 'src/app/core/components/toast/toast.component';
import { of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { AppRoutes, IRoleEnum } from 'src/app/core/constants';
import { ICustomerStatistics } from 'src/app/modules/customers/models';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-customers-more-actions',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="more-actions-menu">
      <button mat-menu-item (click)="displaySide()">
        <mat-icon color="primary" class="menu-item" svgIcon="personal-data"></mat-icon>
        <span>{{ 'display_details_customer' | translate }}</span>
      </button>
      <button mat-menu-item (click)="openUpdateCustomer()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon color="primary" class="menu-item" svgIcon="pen"></mat-icon>
        <span>{{ 'update_data_customer' | translate }}</span>
      </button>
      <button mat-menu-item (click)="recruitmentContract()" authorization [roleValue]="role" [authName]="authCanAdd">
        <mat-icon color="primary" class="menu-item" svgIcon="Add-recruitment-contract"></mat-icon>
        <span>{{ 'add_recruitment_contract' | translate }}</span>
      </button>
      <button mat-menu-item (click)="rentContract()" authorization [roleValue]="roleRent" [authName]="authCanAdd">
        <mat-icon color="primary" class="menu-item" svgIcon="rent"></mat-icon>
        <span>{{ 'add_rent_contract' | translate }}</span>
      </button>
      <button mat-menu-item>
        <mat-icon color="primary" class="menu-item" svgIcon="send-message"></mat-icon>
        <span>{{ 'send_message_dues' | translate }}</span>
      </button>
      <button mat-menu-item>
        <mat-icon color="primary" class="menu-item" svgIcon="send-email"></mat-icon>
        <span>{{ 'send_email' | translate }}</span>
      </button>
      <button mat-menu-item>
        <mat-icon color="primary" class="menu-item" svgIcon="audit"></mat-icon>
        <span>{{ 'display_audit' | translate }}</span>
      </button>
      <button mat-menu-item>
        <mat-icon color="primary" class="menu-item" svgIcon="print"></mat-icon>
        <span>{{ 'print_data_customer' | translate }}</span>
      </button>
      <button
        mat-menu-item
        *ngIf="!params.data.isBlocked"
        (click)="blockCustomer()"
        authorization
        [roleValue]="role"
        [authName]="authCanUpdate">
        <mat-icon color="primary" class="menu-item" svgIcon="block-customer"></mat-icon>
        <span>{{ 'block_costumer' | translate }}</span>
      </button>
      <button
        mat-menu-item
        *ngIf="params.data.isBlocked"
        (click)="unBlockCustomer()"
        authorization
        [roleValue]="role"
        [authName]="authCanUpdate">
        <mat-icon color="primary" class="menu-item" svgIcon="block-customer"></mat-icon>
        <span>{{ 'unblock_costumer' | translate }}</span>
      </button>
      <button
        mat-menu-item
        (click)="deleteCustomerConfirmation()"
        authorization
        [roleValue]="role"
        [authName]="authCanDelete">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'delete_customer' | translate }}</span>
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
export class CustomersMoreActionsCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  role = IRoleEnum.Customer;
  roleRent = IRoleEnum.RentRequest;
  constructor(
    private _customerService: CustomerService,
    private _toast: DialogService,
    private _router: Router,
    @Inject(INJECTOR) injector: Injector
  ) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  displaySide() {
    this._customerService.sideData.next(this.params.data.id);
  }

  openUpdateCustomer() {
    this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.customers}/update/${this.params.data.id}`);
  }

  recruitmentContract() {
    this._router.navigateByUrl(
      `${AppRoutes.layout}/${AppRoutes.contracts}/add-contract/${this.params.data.id}/${this.params.data.name}`
    );
  }

  rentContract() {
    this._router.navigateByUrl(
      `${AppRoutes.layout}/${AppRoutes.rents}/add/${this.params.data.id}/${this.params.data.name}`
    );
  }

  blockCustomer() {
    const toastData: IToastData = {
      messageContent: 'you_want_to_block_customer',
      firstButtonContent: 'cancel',
      secondButtonContent: 'yes',
      svgIcon: 'laptop-toast',
      centralize: true,
    };
    this._toast
      .openDialog(ToastComponent, {
        data: toastData,
      })
      .subscribe((res: any) => {
        if (res)
          this._customerService.blockCustomer(this.params.data.id).subscribe(res => {
            this.params.data.isBlocked = true;
            this.params.api.refreshCells({ columns: ['isBlocked'] });
            this._customerService.updateStatistics.next(<ICustomerStatistics>(<unknown>res?.data));
          });
      });
  }

  unBlockCustomer() {
    const toastData: IToastData = {
      messageContent: 'you_want_to_unblock_customer',
      firstButtonContent: 'cancel',
      secondButtonContent: 'yes',
      svgIcon: 'laptop-toast',
      centralize: true,
    };
    this._toast
      .openDialog(ToastComponent, {
        data: toastData,
      })
      .subscribe((res: any) => {
        if (res)
          this._customerService.blockCustomer(this.params.data.id).subscribe(res => {
            this.params.data.isBlocked = false;
            this.params.api.refreshCells({ columns: ['isBlocked'] });
            this._customerService.updateStatistics.next(<ICustomerStatistics>(<unknown>res?.data));
          });
      });
  }

  deleteCustomerConfirmation() {
    const toastData: IToastData = {
      messageContent: 'you_want_to_delete_customer',
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
        switchMap(res => {
          if (res) {
            return this._customerService.deleteCustomer(this.params.data.id);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(res => {
        if (res) {
          this._customerService.updateStatistics.next(<ICustomerStatistics>res?.data);
          this.params.api.applyTransaction({ remove: [this.params.data] });
        }
      });
  }
}
