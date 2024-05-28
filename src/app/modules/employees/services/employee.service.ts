import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmployeeActions } from '../actions/employee.actions';
import { IEmployee, IEmployeeStatistics } from '../interfaces/employee.interfaces';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private _employeeActions: EmployeeActions;
  private _employeeId = new BehaviorSubject<string | null>(null);
  private _statistics = new BehaviorSubject<IEmployeeStatistics | null>(null);
  public readOnly!: boolean;

  constructor(_http: HttpClient) {
    this._employeeActions = new EmployeeActions(_http);
  }

  //#region Employee Sidebar Info
  getEmployeeIdSubject(): Observable<string | null> {
    return this._employeeId.asObservable();
  }

  setEmployeeIdSubject(Id: string | null, readOnly: boolean) {
    this.readOnly = readOnly;
    this._employeeId.next(Id);
  }
  //#endregion

  //#region Statistics
  getStatistics(): Observable<IEmployeeStatistics | null> {
    return this._statistics.asObservable();
  }

  setStatistics(statistics: IEmployeeStatistics | null): void {
    this._statistics.next(statistics);
  }
  //#endregion

  //#region End Points
  getEmployees(formData: any) {
    return this._employeeActions.get(formData);
  }

  getSupervisors(formData: any) {
    return this._employeeActions.getSupervisors(formData);
  }

  addEmployee(addEmployee: IEmployee) {
    return this._employeeActions.post(addEmployee);
  }

  getEmployeeData(employeeId: string) {
    return this._employeeActions.getEmployee(employeeId);
  }

  infoEmployee(employeeId: string) {
    return this._employeeActions.info(employeeId);
  }

  getUserById(employeeId: string) {
    return this._employeeActions.infoUser(employeeId);
  }

  updateEmployee(id: string, formData: IEmployee) {
    return this._employeeActions.put(id, formData);
  }

  deleteEmployee(id: string) {
    return this._employeeActions.delete(id);
  }

  getAllEmployeesSelect(withCommission: boolean | null, countryId: string | null, type: number | null) {
    return this._employeeActions.getEmployeesSelect(withCommission, countryId, type);
  }

  addEmployeeAccount(formDTo: any) {
    return this._employeeActions.setAccount(formDTo);
  }

  getUsers(formData: any) {
    return this._employeeActions.getUsers(formData);
  }
  //#endregion
}
