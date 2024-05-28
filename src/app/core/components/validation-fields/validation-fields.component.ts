import { Component, Input } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'validation-fields',
  templateUrl: './validation-fields.component.html',
  styleUrls: ['./validation-fields.component.scss'],
})
export class ValidationFieldsComponent {
  @Input('control') control: any;

  constructor() {}

  ngOnInit(): void {}
}
