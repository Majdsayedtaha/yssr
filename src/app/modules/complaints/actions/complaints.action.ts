import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { IComplaint } from '../models/complaints.interface';

export class ComplaintsAction extends CRUDService<IComplaint, any> {
  constructor(http: HttpClient) {
    super(http, 'Complaint');
  }

  add(formData: IComplaint): Observable<IResponse<IComplaint>> {
    return this.createEntity('AddComplaint', formData, 'true');
  }
  put(id: string, formData: IComplaint): Observable<IResponse<IComplaint>> {
    return this.updateEntity('UpdateComplaint', id, formData, 'false');
  }
  updateComplaintStatus(id: string, statusId: string): Observable<IResponse<any>> {
    return this.updateEntity(`UpdateComplaintStatus/${id}?statusId=${statusId}`);
  }
  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<IComplaint, any>>> {
    return this.readPaginationEntities('GetComplaintsTable', formData);
  }
  getInfo(id: string): Observable<IResponse<IComplaint>> {
    return this.readEntity('GetComplaintInfo', id);
  }
  solveComplaint(id: string): Observable<IResponse<IComplaint>> {
    return this.readEntity('SolveComplaint', id);
  }
  delete(id: string): Observable<IResponse<IComplaint>> {
    return this.deleteEntity('Delete', id);
  }
}
