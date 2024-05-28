import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SalePriceActions } from '../actions/sale-price.action';
import { ISalePrice } from '../models';

@Injectable({ providedIn: 'root' })
export class SalePriceService {
  private _salePriceActions: SalePriceActions;

  constructor(private _http: HttpClient) {
    this._salePriceActions = new SalePriceActions(_http);
  }

  getRecruitmentSalary(formData: any) {
    return this._salePriceActions.getRecruitmentSalary(formData);
  }

  getCountrySalePrices(id: string) {
    return this._salePriceActions.getCountrySalePrices(id);
  }

  addCountrySalePrices(formData: ISalePrice) {
    return this._salePriceActions.AddCountrySalePrices(formData);
  }

  deleteSalePrices(id: string) {
    return this._salePriceActions.deleteSalePrice(id);
  }

  updateSalePrice(id: string, formData: any) {
    return this._salePriceActions.updateSalePrice(id, formData);
  }
}
