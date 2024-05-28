import { IResponse } from 'src/app/core/models';
import { IPermission } from 'src/app/modules/settings/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { EmployeesService } from 'src/app/modules/employees/services/employee.service';

@UntilDestroy()
@Component({
  selector: 'app-account-add',
  templateUrl: './account-add.component.html',
  styleUrls: ['./account-add.component.scss'],
})
export class AccountAddComponent extends CoreBaseComponent implements OnInit {
  //#region Variables
  public form!: FormGroup;
  public isLoading: boolean = false;
  public contentData: IPermission[] = [];
  //#endregion

  //#region Accessors
  public f() {
    return this.form.controls;
  }
  //#endregion

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _employeeService: EmployeesService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this._fb.group({
      userName: [null, Validators.required],
      password: [null, Validators.required],
      roleId: [null, Validators.required],
      userId: [null, Validators.required],
    });
    this.watchChangesRoleForm();
  }

  watchChangesRoleForm() {
    this.form.controls['roleId'].valueChanges.pipe(untilDestroyed(this)).subscribe((roleId: string) => {
      if (roleId) this.fetchPermissionsByRole(roleId);
    });
  }

  fetchPermissionsByRole(roleId: string) {
    this.contentData = [];
    this.permissionService
      .getContentsByRoleId(roleId)
      .pipe(untilDestroyed(this))
      .subscribe((response: IResponse<IPermission[]>) => {
        this.contentData = response.data.map(
          el =>
            <IPermission>{
              ...el,
              all: el.canAdd && el.canDelete && el.canUpdate && el.canView,
            }
        );
      });
  }

  getEmployeesSelect() {
    return this.fetchEmployeesSelect();
  }

  submit() {
    if (this.form.valid) {
      const data = this.form.value;
      data.permissions = this.contentData;
      this.isLoading = true;
      this._employeeService
        .addEmployeeAccount(data)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: res => {
            this.isLoading = false;
            this.form.reset();
            this.contentData = [];
          },
          error: () => {
            this.isLoading = false;
          },
        });
    }
  }
}
