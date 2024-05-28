import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExternalOfficeAgreementPriceActions } from '../actions/agreement-price.action';
import { IAgreementPriceForm } from '../models';

@Injectable({ providedIn: 'root' })
export class AgreementPriceService {
  private _externalOfficeAgreementPriceActions: ExternalOfficeAgreementPriceActions;
  public loadingExternalOfficePrice: boolean = false;
  
  constructor(_http: HttpClient) {
    this._externalOfficeAgreementPriceActions = new ExternalOfficeAgreementPriceActions(_http);
  }

  addAgreementPrice(office: any) {
    return this._externalOfficeAgreementPriceActions.post(office);
  }

  getAgreementPrice(agreement: IAgreementPriceForm) {
    return this._externalOfficeAgreementPriceActions.get(agreement);
  }

  getAgreementPrices(externalOfficeId: string) {
    return this._externalOfficeAgreementPriceActions.gets(externalOfficeId);
  }

}
