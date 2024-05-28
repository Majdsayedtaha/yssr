import { finalize } from 'rxjs';
import { IPermission } from '../../models';
import { IResponse } from 'src/app/core/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

@UntilDestroy()
@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent extends CoreBaseComponent implements OnInit {
  //#region Variables
  public form!: FormGroup;
  public rowData: IPermission[] = [];
  public loadingChanges: boolean = false;
  //#endregion

  /**
   *
   * @param injector
   */
  constructor(private _fb: FormBuilder, @Inject(INJECTOR) injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialForm();
  }

  initialForm() {
    this.form = this._fb.group({ roleId: [null, Validators.required] });
    this.watchChangesRoleForm();
  }

  watchChangesRoleForm() {
    this.form.controls['roleId'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((roleId: string) => this.fetchPermissionsByRole(roleId));
  }

  fetchPermissionsByRole(roleId: string) {
    this.rowData = [];
    this.permissionService
      .getContentsByRoleId(roleId)
      .pipe(untilDestroyed(this))
      .subscribe((response: IResponse<IPermission[]>) => {
        this.rowData = response.data.map(
          el =>
            <IPermission>{
              ...el,
              all: el.canAdd && el.canDelete && el.canUpdate && el.canView,
            }
        );
      });
  }

  submit() {
    if (this.form.valid) {
      this.loadingChanges = true;
      const roleId: string = this.form.controls['roleId'].value;
      this.permissionService
        .saveRolePermissions(roleId, this.rowData)
        .pipe(
          untilDestroyed(this),
          finalize(() => (this.loadingChanges = false))
        )
        .subscribe({
          next: res => {
          },
        });
    }
  }
}
