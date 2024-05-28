import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import {
  IAboutToEndWarrantyContracts,
  ICountriesContractsCount,
  IEndRecruitmentContracts,
  IRecruitmentTotalCount,
  IContractsCountPerYear,
  ILastProceduresCount,
  IAllRecruitment,
  IAllWorker,
  ICustomerStatistics,
  IRefundStatistics,
  IWaiverStatistics,
  IRent,
  TotalWorker,
  IRecruitmentStatistics,
} from '../models/home.interface';

export class HomeActions extends CRUDService<any, {}> {
  constructor(http: HttpClient) {
    super(http, 'Home');
  }
  //Recruitment
  getRecruitmentTotalCount(): Observable<IResponse<IRecruitmentTotalCount>> {
    return this.readEntity('GetRecruitmentTotalCount');
  }

  getAboutToEndRecruitmentContracts(): Observable<IResponse<IPagination<IEndRecruitmentContracts, {}>>> {
    return this.readPaginationEntities('GetAboutToEndRecruitmentContracts');
  }

  getLasProceduresCount(): Observable<IResponse<IPagination<ILastProceduresCount, {}>>> {
    return this.readPaginationEntities('GetLasProceduresCount');
  }

  getAboutToEndWarrantyContracts(): Observable<IResponse<IPagination<IAboutToEndWarrantyContracts, {}>>> {
    return this.readPaginationEntities('GetAboutToEndWarrantyContracts');
  }

  getCountriesContractsCount(): Observable<IResponse<ICountriesContractsCount[]>> {
    return this.readEntities('GetCountriesContractsCount');
  }

  getContractsCountPerYear(): Observable<IResponse<IContractsCountPerYear[]>> {
    return this.readEntities('GetContractsCountPerYear');
  }

  getAllRecruitment(date?: any): Observable<IResponse<IAllRecruitment>> {
    if (date?.from && date?.to) {
      return this.readEntity(`Recruitment/GetAll?from=${date.from}&to=${date.to}`);
    } else {
      return this.readEntity(`Recruitment/GetAll`);
    }
  }
  get(formData: any): Observable<IResponse<IPagination<IAllRecruitment, IRecruitmentStatistics>>> {
    return this.readPaginationEntities('Recruitment/GetContractsTable', formData);
  }

  //Worker
  getAllWorker(date: any): Observable<IResponse<IAllWorker>> {
    if (date?.from && date?.to) {
      return this.readEntity(`Worker/GetWorkerAll?from=${date.from}&to=${date.to}`);
    } else {
      return this.readEntity('Worker/GetWorkerAll');
    }
  }
  getTotalWorker(date: any): Observable<IResponse<any>> {
    if (date?.from && date?.to) {
      return this.readEntity(`Worker/GetWithApartmentCount?from=${date.from}&to=${date.to}`);
    } else {
      return this.readEntity('Worker/GetWithApartmentCount');
    }
  }

  //Customer
  getCustomerStatistics(date?: any): Observable<IResponse<ICustomerStatistics>> {
    if (date?.from && date?.to) {
      return this.readEntity(`Customer/GetCustomersStatistics?from=${date.from}&to=${date.to}`);
    } else {
      return this.readEntity('Customer/GetCustomersStatistics');
    }
  }

  //Refund
  getRefundStatistics(date: any): Observable<IResponse<IRefundStatistics>> {
    if (date?.from && date?.to) {
      return this.readEntity(`Return/GetReturnStatistics?from=${date.from}&to=${date.to}`);
    } else {
      return this.readEntity('Return/GetReturnStatistics');
    }
  }

  //Wavier
  getWaiverStatistics(date: any): Observable<IResponse<IWaiverStatistics>> {
    if (date?.from && date?.to) {
      return this.readEntity(`Waiver/GetWaiverStatistics?from=${date.from}&to=${date.to}`);
    } else {
      return this.readEntity('Waiver/GetWaiverStatistics');
    }
  }

  //SponsorshipTransfer
  getSponsorshipTransferStatistics(date: any): Observable<IResponse<any>> {
    if (date?.from && date?.to) {
      return this.readEntity(`SponsorshipTransfer/GetSponsorshipTransferStatistics?from=${date.from}&to=${date.to}`);
    } else {
      return this.readEntity('SponsorshipTransfer/GetSponsorshipTransferStatistics');
    }
  }

  //Rent
  getAllRent(date: any): Observable<IResponse<IRent>> {
    if (date?.from && date?.to) {
      return this.readEntity(`Rent/GetRentAll?from=${date.from}&to=${date.to}`);
    } else {
      return this.readEntity('Rent/GetRentAll');
    }
  }
}
