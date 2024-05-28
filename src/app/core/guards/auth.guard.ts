import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppRoutes } from '../constants/routes';

export const authGuard = (next: ActivatedRouteSnapshot) => {
  const currentUrl = next.url.toString();
  // return inject(AuthService).isLoggedIn()
  //   ? true
  //   : createUrlTreeFromSnapshot(next, ['/', 'login']);

  if (inject(AuthService).isLoggedIn()) {
    if (
      currentUrl.includes(AppRoutes.login) ||
      currentUrl.includes(AppRoutes.forgetPassword) ||
      currentUrl.includes(AppRoutes.resetPassword) ||
      currentUrl.includes(AppRoutes.verificationCode)
    ) {
      return createUrlTreeFromSnapshot(next, ['/', 'layout']);
    } else {
      return true;
    }
  } else {
    // inject(Router).navigate([AppRoutes.login]);
    return true;
  }
};
