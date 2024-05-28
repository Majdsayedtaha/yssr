import { CRUDService } from 'src/app/core/services/crud.service';
import { IHouseWorkerFormData, IHousing, IHousingFormData, IHousingStatistics } from '../models/housing.interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { IEnum } from 'src/app/core/interfaces';

export class HousingActions extends CRUDService<IHousing, IHousingStatistics> {
  constructor(http: HttpClient) {
    super(http, 'Housing');
  }

  get(formData: any): Observable<IResponse<IPagination<IHousing, IHousingStatistics>>> {
    return this.readPaginationEntities('GetHousings', formData);
  }

  create(formData: IHousingFormData): Observable<IResponse<IHousing>> {
    return this.createEntity('AddHousing', formData, 'false');
  }

  update(formData: any): Observable<IResponse<IHousing>> {
    return this.updateEntity('UpdateHousing', formData.id, formData, 'false');
  }

  addHouseWorker(formData: IHouseWorkerFormData): Observable<IResponse<IHousing>> {
    return this.updateEntity('HouseWorkers', undefined, formData, 'false');
  }

  getApartments(value?: string, page?: number): Observable<IResponse<IEnum[] | IHousing[]>> {
    return this.readEntities('GetApartments', {
      query: value || '',
      page: typeof page == 'number' ? page.toString() : '',
    });
  }

  info(Id: string): Observable<IResponse<IHousingFormData | IHousing>> {
    return this.readEntity('GetHousingInfo', Id);
  }

  delete(Id: string): Observable<IResponse<IHousing | IHousingStatistics>> {
    return this.deleteEntity('DeleteHousing', Id);
  }
}
