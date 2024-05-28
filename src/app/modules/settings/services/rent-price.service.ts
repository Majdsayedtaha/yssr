import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RentPriceActions } from '../actions/rental-price.action';
import { IRentPrice } from '../models';

@Injectable({ providedIn: 'root' })
export class RentPriceService {

  private _rentPriceActions: RentPriceActions;

  constructor(private _http: HttpClient) {
    this._rentPriceActions = new RentPriceActions(_http);
  }

  getCountryRentPrices(id: string) {
    return this._rentPriceActions.getCountryRentPrices(id);
  }

  getCountryWithJobRentSalePrices(params: any) {
    return this._rentPriceActions.getCountryWithJobRentSalePrices(params);
  }

  addCountryRentPrices(formData: IRentPrice) {
    return this._rentPriceActions.AddCountryRentPrices(formData);
  }

  deleteRentPrices(id: string) {
    return this._rentPriceActions.deleteRentPrices(id);
  }

  updateRentPrice(id: string, formData: any) {
    return this._rentPriceActions.updateRentPrice(id, formData);
  }

}
