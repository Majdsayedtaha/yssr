import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IEmployee, IEmployeeStatistics, ISupervisor } from '../interfaces/employee.interfaces';
import { IEnum } from 'src/app/core/interfaces';

export class EmployeeActions extends CRUDService<IEmployee, IEmployeeStatistics> {
  constructor(http: HttpClient) {
    super(http, 'Employee');
  }

  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IEmployee, {}>>> {
    return this.readPaginationEntities('GetEmployeesTable', formData);
  }

  getEmployee(id: string): Observable<IResponse<any>> {
    return this.readEntity('GetEmployeeInfo', id);
  }

  post(formData: any): Observable<IResponse<IEmployee>> {
    return this.createEntity('AddEmployee', formData, 'false');
  }

  put(id: string, formData: IEmployee): Observable<IResponse<IEmployee>> {
    return this.updateEntity('UpdateEmployee', id, formData, 'false');
  }

  delete(id: string): Observable<IResponse<IEmployee>> {
    return this.deleteEntity('Delete', id);
  }

  info(id: string): Observable<IResponse<IEmployee>> {
    return this.readEntity('GetEmployeeInfo', id);
  }

  infoUser(id: string): Observable<IResponse<any>> {
    return this.readEntity('GetUserInfo', id);
  }

  setAccount(formDTO: any): Observable<IResponse<IEmployee>> {
    return this.createEntity('SetEmployeeAccount', formDTO, 'false');
  }

  getUsers(formDto: any): Observable<any> {
    return this.readPaginationEntities('GetUsersTable', formDto);
  }

  getSupervisors(formDTO: any): Observable<IResponse<IPagination<ISupervisor | IEmployee, IEmployeeStatistics>>> {
    return this.readPaginationEntities('GetSupervisorsTable', formDTO);
  }

  getEmployeesSelect(
    withCommission: boolean | null,
    countryId: string | null,
    type: number | null
  ): Observable<IResponse<IEnum[] | IEmployee[]>> {
    if (withCommission && countryId) {
      return this.readEntities(`GetEmployeesSelect?withCommission=${withCommission}&countryId=${countryId}`);
    } else if (withCommission) {
      return this.readEntities(`GetEmployeesSelect?withCommission=${withCommission}`);
    } else if (countryId) {
      return this.readEntities(`GetEmployeesSelect?countryId=${countryId}`);
    } else if (type) {
      return this.readEntities(`GetEmployeesSelect?type=${type}`);
    } else return this.readEntities(`GetEmployeesSelect`);
  }
}
