import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEnum } from '../../../core/interfaces';
import { IPagination, IResponse } from '../../../core/models';
import { CRUDService } from '../../../core/services/crud.service';
import { ITemplate } from '../models';

export class TemplateActions extends CRUDService<IEnum> {
  constructor(http: HttpClient) {
    super(http, 'Template');
  }

  // #region Email
  getEmailTemplates(formData: any): Observable<IResponse<IPagination<IEnum, {}>>> {
    return this.readPaginationEntities('GetEmailTemplatesTable', formData);
  }

  getEmailTemplatesSelect(): Observable<IResponse<IPagination<IEnum, {}>>> {
    return this.readPaginationEntities('GetEmailTemplatesSelect');
  }

  addEmailTemplate(formData: any) {
    return this.createEntity('AddEmailTemplate', formData, 'false');
  }

  updateEmailTemplate(formData: any, Id: string) {
    return this.updateEntity('UpdateEmailTemplate', Id, formData, 'false');
  }

  deleteEmailTemplate(id: string) {
    return this.deleteEntity('DeleteEmailTemplate', id);
  }

  getEmailTemplateInfo(Id: string) {
    return this.readEntity('GetEmailTemplateInfo', Id);
  }
  //#endregion

  //#region SMS
  getSmsTemplates(formData: any): Observable<IResponse<IPagination<IEnum, {}>>> {
    return this.readPaginationEntities('GetSMSTemplatesTable', formData);
  }

  getSmsTemplatesSelect(): Observable<IResponse<IPagination<IEnum, {}>>> {
    return this.readPaginationEntities('GetSMSTemplatesSelect');
  }

  addSMSTemplate(formData: any) {
    return this.createEntity('AddSMSTemplate', formData, 'false');
  }

  updateSMSTemplate(formData: any, Id: string) {
    return this.updateEntity('UpdateSMSTemplate', Id, formData, 'false');
  }

  deleteSMSTemplate(id: string) {
    return this.deleteEntity('DeleteSMSTemplate', id);
  }

  getSMSTemplateInfo(Id: string) {
    return this.readEntity('GetSMSTemplateInfo', Id);
  }
  //#endregion
}
