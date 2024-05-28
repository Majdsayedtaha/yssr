import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';

export class AuthActions extends CRUDService<IUser> {
  constructor(http: HttpClient) {
    super(http, 'User');
  }

  signIn(formData: any): Observable<IResponse<IUser>> {
    return this.createEntity('SignIn', formData, 'false');
  }

  forgetPassword(formData: any): Observable<IResponse<any>> {
    return this.createEntity('ForgotPassword', formData, 'false');
  }

  updateUserPassword(updatedPasswordData: any, userId?: string): Observable<IResponse<any>> {
    return userId
      ? this.updateEntity('UpdatePassword/' + userId, '', updatedPasswordData)
      : this.updateEntity('UpdatePassword', '', updatedPasswordData);
  }

  confirmPasswordCode(formData: any): Observable<IResponse<IUser>> {
    return this.createEntity('ConfirmPasswordCode', formData, 'false');
  }

  setNewPassword(formData: any): Observable<IResponse<IUser>> {
    return this.createEntity('SetNewPassword', formData, 'false');
  }

  // logout(): Observable<IResponse<IUser>> {
  //   return this.readEntity('logout');
  // }
}
