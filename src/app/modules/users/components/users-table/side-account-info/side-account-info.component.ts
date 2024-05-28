import { finalize } from 'rxjs';
import { IUserAccountInfo } from '../../../models';
import { MatSidenav } from '@angular/material/sidenav';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { EmployeesService } from 'src/app/modules/employees/services/employee.service';
import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IPermission } from 'src/app/modules/settings/models';
import { UserService } from '../../../services/user.service';

@UntilDestroy()
@Component({
  selector: 'side-account-info',
  templateUrl: './side-account-info.component.html',
  styleUrls: ['./side-account-info.component.scss'],
})
export class SideAccountInfoComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;

  public rowData!: IUserAccountInfo;
  public permissions: IPermission[] = [];
  public isLoading = true;
  public submitLoader = false;
  public readonly!: boolean;
  public userId!: string;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _employeeService: EmployeesService,
    private _userService: UserService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this._employeeService.getEmployeeIdSubject().subscribe(userId => {
      if (userId) {
        this.userId = userId;
        this.readonly = this._employeeService.readOnly;
        this.isLoading = true;
        this.sidenav.open();
        this._employeeService
          .getUserById(userId)
          .pipe(
            untilDestroyed(this),
            finalize(() => (this.isLoading = false))
          )
          .subscribe(response => {
            this.rowData = response.data;
            this.permissions = this.rowData.permissions;
          });
      }
    });
  }

  updatePermissions() {
    this.submitLoader = true;
    this._userService
      .updateUserPermissions({ contents: this.permissions, userId: this.userId })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          this.submitLoader = false;
          this.closeSideNav();
        },
        error: () => {
          this.submitLoader = false;
        },
      });
  }

  closeSideNav() {
    this.sidenav.close();
    this._employeeService.setEmployeeIdSubject(null, true);
  }
  // Life Cycle Hooks
  override ngOnDestroy(): void {
    this.closeSideNav();
    super.ngOnDestroy();
  }
}
