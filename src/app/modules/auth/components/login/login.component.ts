import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { StorageService } from 'src/app/core/services/storage.service';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends CoreBaseComponent implements OnInit {
  loginForm!: FormGroup;
  showPasswordStatus: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    public router: Router,
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _storageService: StorageService,
    private _permissionService: PermissionService,
    private _loadingService: LoaderService,
    @Inject(INJECTOR) injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialForm();
  }

  initialForm() {
    this.loginForm = this._fb.group({
      userNameOrEmail: ['', Validators.required],
      password: [''],
      // rememberMe: [''],
    });
  }

  onLogin() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this._authService
      .login(this.loginForm.value)
      .pipe(
        untilDestroyed(this),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (response) => {

          this._loadingService.show();
          this._permissionService.getUserPermissions().subscribe((response: any) => {
            this._storageService.setLocalObject('dataPermissions', response.data.list);
            this._storageService.dataPermissionsSubject.next(response.data.list);
            this._storageService.notificationsCount.next(response.data.notificationsCount);
            this._loadingService.hide();
          });
          this.router.navigateByUrl('/');
        },
        error: error => {
          // this._serverValidationErrorsService.handlingServerValidations(error, this.loginForm);
          this.errorMessage = error.error.message;
        },
      });
  }

  showPassword(status: boolean) {
    this.showPasswordStatus = status;
  }
}
