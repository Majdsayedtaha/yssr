import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationActions } from '../actions/notification.action';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _notificationAction: NotificationActions;

  constructor(private _http: HttpClient) {
    this._notificationAction = new NotificationActions(_http);
  }

  getNotificationsList(page: number = 0, filteredSectionsIds?: string[]) {
    return this._notificationAction.get(page, filteredSectionsIds);
  }

  getNotificationDetails(NotificationId: string) {
    return this._notificationAction.getDetail(NotificationId);
  }

  deleteNotification(NotificationId: string) {
    return this._notificationAction.delete(NotificationId);
  }
}
