import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompanyActions } from '../actions/company.actions';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private _companyActions: CompanyActions;
  numberOfMonthDays!: number;

  constructor(private _http: HttpClient) {
    this._companyActions = new CompanyActions(_http);
  }

  updateCompany(updatedCompany: FormData) {
    return this._companyActions.post(updatedCompany);
  }

  getCompany() {
    return this._companyActions.get();
  }

  getWarrantyEndCheck() {
    return this._companyActions.getWarranty();
  }

  getCompanyTax() {
    return this._companyActions.getCompanyTax();
  }

  getMonthDays(date: string, isHijri: boolean) {
    return this._companyActions.getMonthDays(date, isHijri);
  }

  getTransformedDate(date: string, isHijri: boolean) {
    return this._companyActions.getTransformedDate(date, isHijri);
  }
}
