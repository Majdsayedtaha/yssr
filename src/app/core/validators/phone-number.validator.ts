import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export class PhoneNumberValidator {
  static phone(numberOfDigits: number = 9): ValidatorFn {
    const phoneNumberPattern = new RegExp(`^[0-9]{${numberOfDigits}}$`);
    return (control: AbstractControl): { [key: string]: any } | null => {
      const hasValue = control.value !== null && control.value !== undefined && control.value !== '';
      const valid = phoneNumberPattern.test(control.value);
      if (control.hasValidator(Validators.required) && !hasValue) return { required: true };
      return valid ? null : control.value ? { invalidTelephone: numberOfDigits } : null;
    };
  }
}
