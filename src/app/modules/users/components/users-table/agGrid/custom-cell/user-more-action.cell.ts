import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EmployeesService } from 'src/app/modules/employees/services/employee.service';
import { IToastData, ToastComponent } from 'src/app/core/components/toast/toast.component';
import { of, switchMap } from 'rxjs';
import { UserService } from 'src/app/modules/users/services/user.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ChangeUserPasswordComponent } from 'src/app/modules/layout/components/navbar/change-user-password/change-user-password.component';

@UntilDestroy()
@Component({
  selector: 'app-Users-more-actions',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="more-actions-menu">
      <button mat-menu-item (click)="displayDetails()">
        <mat-icon color="primary" class="menu-item" svgIcon="personal-data"></mat-icon>
        <span>{{ 'label.user.info' | translate }}</span>
      </button>
      <button mat-menu-item (click)="displayPermissions()">
        <mat-icon color="primary" class="menu-item" svgIcon="managing-operations"></mat-icon>
        <span>{{ 'label.user.edit_permissions' | translate }}</span>
      </button>
      <button mat-menu-item (click)="openChangeUserPasswordDialog()">
        <mat-icon color="primary" class="menu-item" svgIcon="change-password"></mat-icon>
        <span>{{ 'label.user.change_password' | translate }}</span>
      </button>
      <button mat-menu-item (click)="deleteUser()">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'label.user.delete' | translate }}</span>
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
export class UserMoreActionsCell implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  constructor(
    private _toast: DialogService,
    private _employeeService: EmployeesService,
    private _userService: UserService
  ) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  displayDetails() {
    this._employeeService.setEmployeeIdSubject(this.params.data.id, true);
  }

  displayPermissions() {
    this._employeeService.setEmployeeIdSubject(this.params.data.id, false);
  }

  // Change password
  openChangeUserPasswordDialog() {
    this._toast
      .openDialog(ChangeUserPasswordComponent, { size: 'l', data: { userId: this.params.data.id } })
      .subscribe();
  }

  deleteUser() {
    const toastData: IToastData = {
      messageContent: 'you_want_to_delete_user',
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
        switchMap(res => (res ? this._userService.deleteUser(this.params.data.id) : of(null)))
      )
      .subscribe(res => {
        if (res) this.params.api.applyTransaction({ remove: [this.params.data] });
      });
  }
}
