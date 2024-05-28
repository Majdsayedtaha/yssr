import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';

export class NotificationActions extends CRUDService<any, any> {
  constructor(http: HttpClient) {
    super(http, 'Notification');
  }

  get(page: number = 0, filteredSectionsIds?: string[]): Observable<any> {
    return this.getListPutParams(`GetNotifications?PageNumber=${page}&PageSize=10`, filteredSectionsIds);
  }

  getDetail(notificationId: string): Observable<IResponse<any>> {
    return this.readEntity('GetNotificationInfo', notificationId);
  }

  delete(notificationId: string): Observable<IResponse<any>> {
    return this.deleteEntity('Delete', notificationId);
  }
}
