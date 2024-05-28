import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { ICompany } from '../models';

export class CompanyActions extends CRUDService<ICompany, {}> {
  constructor(http: HttpClient) {
    super(http, 'Company');
  }

  post(formData: any): Observable<IResponse<ICompany>> {
    return this.createEntity('UpdateCompany', formData, 'false');
  }

  get(): Observable<IResponse<ICompany>> {
    return this.readEntity('GetCompanyInfo');
  }

  getWarranty(): Observable<IResponse<ICompany>> {
    return this.readEntity('GetWarrantyEndCheck');
  }

  getCompanyTax(): Observable<IResponse<ICompany>> {
    return this.readEntity('GetCompanyTax');
  }

  getMonthDays(date: string, isHijri: boolean): Observable<any> {
    return this.readEntity(`getMonthDays?date=${date}&isHijri=${isHijri}`);
  }

  getTransformedDate(date: string, isHijri: boolean): Observable<any> {
    return this.readEntity(`GetTransformedDate?date=${date}&isHijri=${isHijri}`);
  }
}
