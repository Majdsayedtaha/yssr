import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IContract, IContractStatistics, IContractFormData, IContractWarrantyStatistics,  } from '../models';

export class ContractActions extends CRUDService<
  IContractFormData,
  IContractStatistics | IContractWarrantyStatistics | any
> {
  constructor(http: HttpClient) {
    super(http, 'RecruitmentContract');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IContract, IContractStatistics>>> {
    return this.readPaginationEntities('GetContracts', formData);
  }

  getWarranty(formData: {
    [key: string]: string;
  }): Observable<IResponse<IPagination<IContract, IContractWarrantyStatistics>>> {
    return this.readPaginationEntities('GetWarrantyContracts', formData);
  }

  finishWarranty(id: string): Observable<any> {
    return this.updateQueryEntity(`EndWarranty/${id}`);
  }

  extendWarranty(formDto: any, id: string): Observable<any> {
    return this.updateQueryEntity(`ExtendWarranty/${id}`, formDto);
  }

  getDetail(contractId: string): Observable<IResponse<IContractFormData>> {
    return this.readEntity('GetContractInfo', contractId);
  }

  delete(contractId: string): Observable<IResponse<IContract | IContractStatistics>> {
    return this.deleteEntity('DeleteContract', contractId);
  }

  add(formData: IContractFormData): Observable<IResponse<IContract>> {
    return this.createEntity('AddContract', formData, 'false');
  }

  put(id: string, formData: IContractFormData): Observable<IResponse<IContract>> {
    return this.updateEntity('UpdateContract', id, formData, 'false');
  }

  putLinkContract(formData: any): Observable<IResponse<any>> {
    return this.updateEntity('LinkWorkerToContract', '', formData, 'false');
  }

  getCustomerOrContract(type: string, id: string): Observable<IResponse<any>> {
    if (type === 'customer') return this.readEntities('GetCustomerContractSelect?customerId=' + id);
    else return this.readEntities('GetCustomerContractSelect?contractId=' + id);
  }
}
