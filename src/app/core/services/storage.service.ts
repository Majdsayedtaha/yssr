import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user.interface';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../constants/storage';
import { BehaviorSubject, Subject, share } from 'rxjs';
import { IPermission } from 'src/app/modules/settings/models';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage$ = new Subject<{ key: string; value: any }>();
  user: IUser;
  dataPermissionsSubject = new BehaviorSubject<IPermission[]>([]);
  notificationsCount = new BehaviorSubject<number>(-1);
  storageChanges$ = this.storage$.asObservable().pipe(share());

  constructor() {
    this.user = this.getLocalObject(USER_STORAGE_KEY);
    this.start();
  }

  private start(): void {
    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea == localStorage) {
      let v;
      try {
        v = JSON.parse(event.newValue || '');
      } catch (e) {
        v = event.newValue;
      }
      this.storage$.next({ key: event.key || '', value: v });
    }
  }

  private stop(): void {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
    this.storage$.complete();
  }

  //#region Token
  setToken(token: string): void {
    this.setLocalObject(TOKEN_STORAGE_KEY, token);
  }

  getToken(): string {
    return this.getLocalObject(TOKEN_STORAGE_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
  //#end region

  //#region Session
  setSessionObject(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSessionObject(key: string) {
    return JSON.parse(String(sessionStorage.getItem(key)));
  }

  removeSessionObject(item: string) {
    sessionStorage.removeItem(item);
  }

  clearSession() {
    sessionStorage.clear();
  }
  //#end region

  //#region Local
  setLocalObject(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
    this.storage$.next({ key: key, value: value });
  }

  getLocalObject(key: string): any | null {
    return JSON.parse(String(localStorage.getItem(key)));
  }

  removeLocalObject(item: string) {
    localStorage.removeItem(item);
    this.storage$.next({ key: item, value: null });
  }

  clearLocal() {
    localStorage.clear();
  }

  ngOnDestroy() {
    this.stop();
  }

  //#end region
}
