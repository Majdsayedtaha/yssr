import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export class FakeLengthNumberValidator {
  static number(): ValidatorFn {
    const phoneNumberPattern: RegExp = /^[0-9]{9}$/;
    return (control: AbstractControl): { [key: string]: any } | null => {
      const hasValue = control.value !== null && control.value !== undefined && control.value !== '';
      const valid = phoneNumberPattern.test(control.value);
      if (control.hasValidator(Validators.required) && !hasValue) return { required: true };
      return valid ? null : control.value ? { invalidPhoneNumber: { value: control.value } } : null;
    };
  }
}
