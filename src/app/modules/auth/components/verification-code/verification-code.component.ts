import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.scss'],
})
export class VerificationCodeComponent {
  //#region Variables
  verificationCodeForm!: FormGroup;
  loading: boolean = false;
  //#end region

  /**
   * @param {Router} _router
   * @param {FormBuilder} _fb
   * @param {AuthService} _authService
   * @param {ActivatedRoute} _activatedRoute-
   */
  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _activatedRoute: ActivatedRoute
  ) {}

  //#region Form
  initialForm() {
    this.verificationCodeForm = this._fb.group({
      code: [''],
    });
  }
  //#end region

  //#region Actions
  verificationCode() {
    if (!this.verificationCodeForm.valid) {
      this.verificationCodeForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const email = this._activatedRoute.snapshot.queryParams['email'];
    const queryParams = { email: email };

    this._authService
      .verificationCode(email, this.verificationCodeForm.value.code)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this._router.navigate(['reset-password'], { queryParams });
        },
        error: () => {
          this.loading = false;
        },
      });
  }
  //#end region

  //#region Life Cycle
  ngOnInit(): void {
    this.initialForm();
  }
  //#end region
}
