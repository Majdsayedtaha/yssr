import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { AuthService } from 'src/app/core/services/auth.service';

@UntilDestroy()
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent extends CoreBaseComponent implements OnInit {
  loading = false;
  errorMessage = '';
  //#region Variables
  forgetPasswordForm!: FormGroup;
  //#end region

  /**
   * @param {Router} _router
   * @param {FormBuilder} _fb
   * @param {AuthService} _authService
   * @param {Injector} injector
   */
  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _authService: AuthService,
    @Inject(INJECTOR) injector: Injector
  ) {
    super(injector);
  }

  //#region Form

  initialForm() {
    this.forgetPasswordForm = this._fb.group({
      email: [''],
      phoneNumber: [''],
    });
  }

  //#end region

  //#region Actions
  sendEmail() {
    if (!this.forgetPasswordForm.valid) {
      this.forgetPasswordForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const email = this.forgetPasswordForm.value.email;
    const queryParams = { email: email };

    this._authService
      .forgetPassword(email)
      .pipe(
        untilDestroyed(this),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: () => {
          this._router.navigate(['verification-code'], { queryParams });
        },
        error: error => {
          this.errorMessage = error.error.message;
        },
      });
  }
  //#end region

  //#region LifeCycle
  ngOnInit(): void {
    this.initialForm();
  }
  //#end region
}
