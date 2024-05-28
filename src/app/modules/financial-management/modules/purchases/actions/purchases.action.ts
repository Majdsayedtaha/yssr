import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';

export class PurchaseActions extends CRUDService<any, any> {
  constructor(http: HttpClient) {
    super(http, 'Purchase');
  }

  add(formData: any): Observable<IResponse<any>> {
    return this.createEntity('AddPurchase', formData, 'true');
  }

  put(id: string, formData: any): Observable<IResponse<any>> {
    return this.updateEntity('UpdatePurchase', id, formData, 'false');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<any, any>>> {
    return this.readPaginationEntities('GetPurchasesTable', formData);
  }

  getInfo(id: string): Observable<IResponse<any>> {
    return this.readEntity('GetPurchaseInfo', id);
  }

  delete(id: string): Observable<IResponse<any>> {
    return this.deleteEntity('Delete', id);
  }

  generatePurchaseNumber() {
    return this.readEntity('GeneratePurchaseNumber');
  }
}
