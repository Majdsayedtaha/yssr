import { HttpClient } from '@angular/common/http';
import { CRUDService } from 'src/app/core/services/crud.service';
import { ISalePrice } from '../models';

export class SalePriceActions extends CRUDService<ISalePrice, {}> {
  constructor(http: HttpClient) {
    super(http, 'SalePrice');
  }

  getRecruitmentSalary(formData: any): any {
    return this.readEntities(
      'GetRecruitmentSalary?religionId=' +
        formData.religionId +
        '&jobId=' +
        formData.jobId +
        '&experienceTypeId=' +
        formData.experienceTypeId +
        '&countryId=' +
        formData.countryId
    );
  }

  getCountrySalePrices(id: string) {
    return this.readEntity('GetCountrySalePrices', id);
  }

  AddCountrySalePrices(formData: ISalePrice) {
    return this.createEntity('AddSalePrice', formData, 'false');
  }

  deleteSalePrice(id: string) {
    return this.deleteEntity('Delete', id);
  }

  updateSalePrice(id: string, formData: any) {
    return this.updateEntity('updateSalePrice', id, formData, 'false');
  }
}
