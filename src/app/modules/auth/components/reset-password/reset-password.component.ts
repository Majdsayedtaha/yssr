import { Component, OnInit, INJECTOR, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent extends CoreBaseComponent implements OnInit {
  //#region Variables
  resetPasswordForm!: FormGroup;
  showNewPasswordStatus = false;
  showPasswordStatus = false;
  loading: boolean = false;
  //#end region

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    @Inject(INJECTOR) injector: Injector
  ) {
    super(injector);
  }

  //#region Form
  initialForm() {
    this.resetPasswordForm = this._fb.group({
      password: [''],
      newPassword: [''],
      // rememberMe: [''],
    });
  }
  //#end region

  //#region Actions
  resetPasswordThenLogin() {
    if (!this.resetPasswordForm.valid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const email = this._activatedRoute.snapshot.queryParams['email'];
    const newPassword = this.resetPasswordForm.value.newPassword;
    this._authService
      .resetPassword(email, newPassword)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this._authService.login(
            {
              userNameOrEmail: email,
              password: newPassword,
            }
            // this.resetPasswordForm.value.rememberMe
          );
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  showPassword(status: boolean) {
    this.showPasswordStatus = status;
  }

  showNewPassword(status: boolean) {
    this.showNewPasswordStatus = status;
  }
  //#end region

  //#region Life Cycle
  ngOnInit(): void {
    this.initialForm();
  }
  //#end region
}
