import { IRoleEnum, IRolePermissionsEnum, RoleAdminEnum, USER_STORAGE_KEY } from '../constants';
import { Directive, ElementRef, Input } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { IPermission } from 'src/app/modules/settings/models';

@Directive({
  selector: '[authorization]',
})
export class AuthorizationDirective {
  @Input('roleName') roleName: string = 'role';
  @Input('roleValue') roleValue!: number;
  @Input('roleCss') roleCss: string = 'flex';
  @Input('roleShownAlways') roleShownAlways: boolean = false;
  @Input('isAdmin') isAdmin: boolean = false;
  @Input('authName') authName!: IRolePermissionsEnum | IRolePermissionsEnum[];
  public dataPermissions!: IPermission[];

  constructor(private el: ElementRef, private _storageService: StorageService) {
    this.dataPermissions = this._storageService.dataPermissionsSubject.value;
  }

  ngOnInit(): void {
    if (this.dataPermissions.length > 0) {
      {
        if (
          this.roleShownAlways ||
          this.checkPermission(this.dataPermissions) ||
          (this._storageService.getLocalObject(USER_STORAGE_KEY)?.role === RoleAdminEnum.CompanyManager && this.isAdmin)
        )
          this.el.nativeElement.style.display = this.roleCss;
        else this.el.nativeElement.style.display = 'none';
      }
    } else {
      this._storageService.dataPermissionsSubject.subscribe(data => {
        this.dataPermissions = data;
        if (
          this.roleShownAlways ||
          this.checkPermission(data) ||
          (this._storageService.getLocalObject(USER_STORAGE_KEY)?.role === RoleAdminEnum.CompanyManager && this.isAdmin)
        )
          this.el.nativeElement.style.display = this.roleCss;
        else this.el.nativeElement.style.display = 'none';
      });
    }
  }

  checkPermission(permissions: IPermission[]) {
    const authorized =
      permissions.findIndex(
        (permission: IPermission) =>
          permission.value == this.roleValue &&
          (typeof this.authName === 'string'
            ? permission[this.authName as IRolePermissionsEnum]
            : this.checkIfOneOfActionMeet(this.authName as IRolePermissionsEnum[], permission))
      ) !== -1;
    return authorized;
  }

  checkIfOneOfActionMeet(authActions: IRolePermissionsEnum[], permission: IPermission) {
    let authorized = false;
    authActions.forEach(authAction => (permission[authAction] ? (authorized = true) : ''));
    return authorized;
  }
}
