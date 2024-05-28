import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogIdentityComponent } from 'src/app/modules/customers/components/toaster/dialog-identity/dialog-identity.component';

@Component({
  selector: 'app-change-user-password',
  templateUrl: './change-user-password.component.html',
  styleUrls: ['./change-user-password.component.scss'],
})
export class ChangeUserPasswordComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  passwordVisibility = {
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  };
  showMismatchMessage = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: { userId: string },
    private _fb: FormBuilder,
    private _dialog: MatDialogRef<DialogIdentityComponent>,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    this.initialForm();
  }

  initialForm() {
    this.form = this._fb.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  passwordMatchValidator(): boolean {
    const newPass = this.form.get('newPassword')?.value;
    const confirmedPass = this.form.get('confirmPassword')?.value;
    return newPass === confirmedPass;
  }

  confirmChangePassword() {
    this.showMismatchMessage = !this.passwordMatchValidator();
    if (!this.form.valid || this.showMismatchMessage) return;
    this.loading = true;

    const passwordsData = this.form.value;
    delete passwordsData.confirmPassword;

    this._auth.updateUserPassword(passwordsData, this.passedData?.userId).subscribe({
      next: () => {
        this.loading = false;
        this.closeDialog();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  closeDialog() {
    if (!this.loading) {
      this.loading = false;
      this._dialog.close({ form: this.form.value });
    }
  }

  togglePasswordVisibility(fieldName: string) {
    this.passwordVisibility[fieldName as keyof typeof this.passwordVisibility] =
      !this.passwordVisibility[fieldName as keyof typeof this.passwordVisibility];
  }
}
