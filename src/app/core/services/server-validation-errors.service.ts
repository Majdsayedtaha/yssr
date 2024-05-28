import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ServerValidationErrorsService {
  constructor() {}

  handlingServerValidations(error: HttpErrorResponse, form: FormGroup) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 400) {
        //! I'm not sure about next line hierarchy, need to take a look on back error yet.
        const validationErrors = error.error.errors;

        Object.keys(validationErrors).forEach(prop => {
          const formControl = form.get(prop);
          if (formControl) {
            formControl.setErrors({
              serverError: validationErrors[prop],
            });
          }
        });
      }
    }
  }
}
