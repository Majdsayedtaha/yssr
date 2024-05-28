import { AbstractControl, Validators } from '@angular/forms';

export class CustomEmailValidator {
  static email(control: AbstractControl) {
    const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const hasValue = control.value !== null && control.value !== undefined && control.value !== '';
    const isEmail: boolean = emailRegex.test(control.value);

    if (control.hasValidator(Validators.required) && !hasValue) return { required: true };
    return isEmail ? null : control.value ? { email: { value: control.value } } : null;
  }
}
