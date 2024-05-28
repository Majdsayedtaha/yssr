import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user.interface';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { AuthActions } from 'src/app/modules/auth/actions/auth.actions';
import { HttpClient } from '@angular/common/http';
import { USER_STORAGE_KEY } from '../constants';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser$ = new BehaviorSubject<IUser | null>(null);
  fcmToken: string = '';
  private _authActions: AuthActions;

  constructor(private _http: HttpClient, private _router: Router, private _storageService: StorageService) {
    this._authActions = new AuthActions(_http);

    this._storageService.storageChanges$.subscribe(v => {
      if (
        this._storageService.getLocalObject('token') &&
        this._storageService.getLocalObject('user') &&
        this._storageService.getLocalObject('dataPermissions') &&
        this._router.url.includes('login')
      ) {
        this._router.navigateByUrl('/');
      } else if (
        (!this._storageService.getLocalObject('token') ||
          !this._storageService.getLocalObject('user') ||
          !this._storageService.getLocalObject('dataPermissions')) &&
        !this._router.url.includes('login')
      )
        this._router.navigateByUrl('/login');
    });
  }

  login(loginUserData: { userNameOrEmail: string; password: string }) {
    return this._authActions.signIn({ ...loginUserData, fcmToken: this.fcmToken }).pipe(
      map(({ data }: { data: IUser }) => {
        this._storageService.setLocalObject(USER_STORAGE_KEY, data);
        this._storageService.setToken(data.token);
        this.currentUser$.next(data);
      })
    );
  }

  autoLogin() {
    const userData = this._storageService.getLocalObject(USER_STORAGE_KEY);
    if (!userData) {
      this.currentUser$.next(null);
      this._router.navigateByUrl('login');
      return;
    }
    this.currentUser$.next(userData);
  }

  forgetPassword(email: string) {
    return this._authActions.forgetPassword(email);
  }

  verificationCode(email: string, code: string) {
    return this._authActions.setNewPassword({ email, code });
  }

  resetPassword(email: string, newPassword: string) {
    return this._authActions.setNewPassword({ email, newPassword });
  }

  logout() {
    this._storageService.clearLocal();
    this._storageService.clearSession();
    this._storageService.dataPermissionsSubject.next([]);
    this._router.navigateByUrl('/auth/login');
  }

  updateUserPassword(updatedPasswordData: any, userId?: string) {
    return this._authActions.updateUserPassword(updatedPasswordData, userId);
  }

  isLoggedIn(): boolean {
    if (this._storageService.getLocalObject(USER_STORAGE_KEY)) return true;
    return false;
  }
}
