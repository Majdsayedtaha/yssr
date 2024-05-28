import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IName } from '../models';
import { CareerActions } from '../actions/career.action';

@Injectable({ providedIn: 'root' })
export class CareerService {
  private _careerActions: CareerActions;
  constructor(private _http: HttpClient) {
    this._careerActions = new CareerActions(_http);
  }

  getCareers(formData: any) {
    return this._careerActions.get(formData);
  }

  getCareerInfo(id: string) {
    return this._careerActions.getInfo(id);
  }

  addCareer(addCareer: IName) {
    return this._careerActions.post(addCareer);
  }

  updateCareer(id:string,formData:IName) {
    return this._careerActions.put(id,formData);
  }

  deleteCareer(id:string) {
    return this._careerActions.delete(id);
  }
}
