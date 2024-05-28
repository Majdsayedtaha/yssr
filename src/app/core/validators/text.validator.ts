import { AbstractControl, Validators } from '@angular/forms';

export class TextValidator {
  static arabic(control: AbstractControl) {
    const arabicRegex: RegExp = /^[\u0621-\u064A0-9\u064B-\u0652 ]+$/;
    const hasValue = control.value !== null && control.value !== undefined && control.value !== '';
    const isArabic: boolean = arabicRegex.test(control.value);

    if (control.hasValidator(Validators.required) && !hasValue) return { required: true };
    return isArabic ? null : control.value ? { textNotArabic: { value: control.value } } : null;
  }

  static english(control: AbstractControl) {
    const englishRegex: RegExp = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
    const hasValue = control.value !== null && control.value !== undefined && control.value !== '';
    const isEnglish: boolean = englishRegex.test(control.value);

    if (control.hasValidator(Validators.required) && !hasValue) return { required: true };
    return isEnglish ? null : control.value ? { textNotEnglish: { value: control.value } } : null;
  }
}
