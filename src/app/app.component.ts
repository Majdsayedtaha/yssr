import { ICONS } from './core/models';
import { TranslateService } from '@ngx-translate/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from './core/services/auth.service';
import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { StorageService } from './core/services/storage.service';
import { DirectionService } from './core/services/direction.service';
import { PermissionService } from './core/services/permission.service';
import { Observable, fromEvent, retry } from 'rxjs';
import { LoaderService } from './core/services/loader.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from 'src/environments/environment';
import { NotifierService } from './core/services/notifier.service';
@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showLoader: boolean = true;
  // offlineEvent!: Observable<Event>;
  onlineEvent!: Observable<Event>;
  isTabFocused = true;

  constructor(
    private _renderer: Renderer2,
    private _sanitizer: DomSanitizer,
    private _authService: AuthService,
    private _direction: DirectionService,
    private _storageService: StorageService,
    private _matIconRegistry: MatIconRegistry,
    private _translateService: TranslateService,
    private _permissionService: PermissionService,
    private _loadingService: LoaderService,
    private _notifier: NotifierService
  ) {}

  ngOnInit(): void {
    this.setUpLoading();
    this.checkBrowserLang();
    this.loadIcons();
    this._authService.autoLogin();
    if (this._storageService.getToken()) this.fetchUserPermissions();
    this.getFirebaseToken();
    this.notificationListener();
    this.handleAppConnectivityChanges();
  }

  @HostListener('document:visibilitychange')
  handleVisibilityChange() {
    this.isTabFocused = document.visibilityState === 'visible';
  }

  private getFirebaseToken() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.firebase.vapidKey })
      .then(currentToken => {
        this._authService.fcmToken = currentToken;
      })
      .catch(err => {
        this._authService.fcmToken = '';
      });
  }

  private notificationListener() {
    const messaging = getMessaging();
    onMessage(messaging, payload => {
      this._storageService.notificationsCount.next(this._storageService.notificationsCount.getValue() + 1);
      this.isTabFocused ? this._notifier.showNormalSnack(payload.notification?.body || '') : '';
    });
  }

  private setUpLoading() {
    this.showLoader = this._loadingService.isLoading.value;
    this._loadingService.isLoading
      .asObservable()
      .pipe(untilDestroyed(this))
      .subscribe(isLoading => {
        this.showLoader = isLoading;
      });
  }

  private loadIcons() {
    ICONS.forEach(icon =>
      this._matIconRegistry.addSvgIcon(icon.name, this._sanitizer.bypassSecurityTrustResourceUrl(icon.url))
    );
  }

  private checkBrowserLang() {
    const currentLang = this._storageService.getLocalObject('lang');
    this._translateService.setDefaultLang(currentLang ? currentLang : 'ar');
    this._translateService.use(currentLang ? currentLang : 'ar');
    this._renderer.setAttribute(document.body, 'dir', currentLang === 'en' ? 'ltr' : 'rtl');
    this._direction.setDirection(currentLang === 'en' ? 'ltr' : 'rtl');
  }

  private fetchUserPermissions() {
    this._loadingService.show();
    this._permissionService
      .getUserPermissions()
      .pipe(
        untilDestroyed(this),
        retry({
          delay: 5000,
          resetOnSuccess: true,
        })
      )
      .subscribe({
        next: (response: any) => {
          this._storageService.setLocalObject('dataPermissions', response.data.list);
          this._storageService.dataPermissionsSubject.next(response.data.list);
          this._storageService.notificationsCount.next(response.data.notificationsCount);
          this._loadingService.hide();
        },
      });
  }

  private handleAppConnectivityChanges(): void {
    this.onlineEvent = fromEvent(window, 'online');
    // this.offlineEvent = fromEvent(window, 'offline');

    this.onlineEvent.pipe(untilDestroyed(this)).subscribe(e => {
      this._loadingService.isLoading.getValue() ? location.reload() : '';
    });
  }
}
