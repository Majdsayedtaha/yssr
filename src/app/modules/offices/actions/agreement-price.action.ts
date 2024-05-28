import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IAgreementPriceForm } from '../models';

export class ExternalOfficeAgreementPriceActions extends CRUDService<IAgreementPriceForm, {}> {

  constructor(http: HttpClient) {
    super(http, 'AgreementPrice');
  }

  post(formData: IAgreementPriceForm): Observable<IResponse<IAgreementPriceForm>> {
    return this.createEntity('AddAgreementPrice', formData, 'false');
  }

  get(formDATA: any): Observable<any> {
    return this.readEntities('GetAgreementPrice', formDATA);
  }

  gets(Id: string): Observable<any> {
    return this.readEntities(`GetAgreementPrices`, { externalOfficeId: Id });
  }

}
