import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';

export class PurchaseReturnActions extends CRUDService<any, any> {
  constructor(http: HttpClient) {
    super(http, 'Purchase');
  }

  add(formData: any): Observable<IResponse<any>> {
    return this.createEntity('AddReturnedPurchase', formData, 'true');
  }

  put(id: string, formData: any): Observable<IResponse<any>> {
    return this.updateEntity('UpdateReturnedPurchase', id, formData, 'false');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<any, any>>> {
    return this.readPaginationEntities('GetReturnedPurchasesTable', formData);
  }

  getInfo(id: string): Observable<IResponse<any>> {
    return this.readEntity('GetPurchaseInfo', id);
  }

  getContractsForPurchases(externalOfficeId: string, paginationOptions: any): Observable<IResponse<any>> {
    return this.readPaginationEntities(`GetContractsForPurchases/${externalOfficeId}`, paginationOptions);
  }

  delete(id: string): Observable<IResponse<any>> {
    return this.deleteEntity('Delete', id);
  }

  generatePurchaseReturnNumber() {
    return this.readEntity('GeneratePurchaseNumber');
  }
}
