import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, catchError, exhaustMap, map, take, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { DialogService } from '../services/dialog.service';
import { NotifierService } from '../services/notifier.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class MainHttpInterceptor implements HttpInterceptor {
  constructor(
    private _translateService: TranslateService,
    private _authService: AuthService,
    private _dialogService: DialogService,
    private _storageService: StorageService,
    private _notifier: NotifierService,
    private _notifierService: NotifierService,
    private _router: Router,
    private _loadingService: LoaderService
  ) {}

  getCurrentLanguage(): string {
    if (this._translateService.currentLang) return this._translateService.currentLang;
    else return this._translateService.getDefaultLang();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this._authService.currentUser$.pipe(
      take(1),
      exhaustMap(() => {
        const modifiedReq = req.clone({
          setHeaders: {
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept-Language': req.url.includes('GetTransformedDate') ? 'en' : this.getCurrentLanguage() || 'ar',
            authorization: 'Bearer ' + this._storageService.getToken(),
          },
        });
        return next.handle(modifiedReq).pipe(
          map(event => {
            if (event instanceof HttpResponse) {
              if (event.status === 200 && event.body?.message) {
                if (req.method === 'POST' && req.headers.get('showMessage') === 'true') {
                  this._dialogService.successNotify(event.body?.message, 'success-request', '', '', true);
                }
                if (
                  (req.method === 'PUT' || req.method === 'POST' || req.method === 'DELETE') &&
                  req.headers.get('showMessage') !== 'true' &&
                  !req.url.includes('SignIn')
                ) {
                  this._notifierService.showNormalSnack(this._translateService.instant(event.body?.message));
                }
              }
            }
            return event;
          }),
          catchError((err: HttpErrorResponse) => {
            if (err.status === 400 && err.error.message && !req.headers.has('hideNotification'))
              this._notifier.showNotification(err.error.message, 'warning');
            if (err.status === 500) this._notifier.showNotification(err.error.message, 'error');
            if (err.status === 401 && err.url?.includes('GetUserContents')) {
              this._router.navigateByUrl('/auth/login');
              this._loadingService.hide();
            }
            return throwError(() => err);
          })
        );
      })
    );
  }
}
