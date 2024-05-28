import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TemplateActions } from '../actions/template.actions';
@Injectable({ providedIn: 'root' })
export class TemplatesService {
  private _templateActions: TemplateActions;

  constructor(private _http: HttpClient) {
    this._templateActions = new TemplateActions(_http);
  }

  //#region Email
  getEmailTemplates(formData?: any) {
    return this._templateActions.getEmailTemplates(formData);
  }

  getEmailTemplatesSelect() {
    return this._templateActions.getEmailTemplatesSelect();
  }

  createEmailTemplate(formData: any) {
    return this._templateActions.addEmailTemplate(formData);
  }

  editEmailTemplate(formData: any, id: string) {
    return this._templateActions.updateEmailTemplate(formData, id);
  }

  deleteEmailTemplate(id: string) {
    return this._templateActions.deleteEmailTemplate(id);
  }

  getEmailInfo(Id: string) {
    return this._templateActions.getEmailTemplateInfo(Id);
  }
  //#endregion


  //#region SMS
  getSMSTemplates(formData?: any) {
    return this._templateActions.getSmsTemplates(formData);
  }

  getSMSTemplatesSelect() {
    return this._templateActions.getSmsTemplatesSelect();
  }

  createSMSTemplate(formData: any) {
    return this._templateActions.addSMSTemplate(formData);
  }

  editSMSTemplate(formData: any, id: string) {
    return this._templateActions.updateSMSTemplate(formData, id);
  }

  deleteSMSTemplate(id: string) {
    return this._templateActions.deleteSMSTemplate(id);
  }

  getSMSInfo(Id: string) {
    return this._templateActions.getSMSTemplateInfo(Id);
  }
  //#endregion

}
