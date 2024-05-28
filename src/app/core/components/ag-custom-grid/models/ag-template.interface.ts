import { Observable } from 'rxjs';
export interface IAgTemplate {
  getList(): Observable<any>;
}
