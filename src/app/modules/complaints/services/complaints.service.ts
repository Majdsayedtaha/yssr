import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ComplaintsAction } from '../actions/complaints.action';
@Injectable({ providedIn: 'root' })
export class ComplaintsService {
  private _complaintsAction: ComplaintsAction;

  constructor(private _http: HttpClient) {
    this._complaintsAction = new ComplaintsAction(_http);
  }

  addComplaints(newComplaints: any) {
    return this._complaintsAction.add(newComplaints);
  }

  updateComplaints(complaintsId: string, updatedComplaints: any) {
    return this._complaintsAction.put(complaintsId, updatedComplaints);
  }

  updateComplaintStatus(complaintsId: string, statusId: any) {
    return this._complaintsAction.updateComplaintStatus(complaintsId, statusId);
  }

  getComplaintsList(formParams: any) {
    return this._complaintsAction.get(formParams);
  }

  getComplaintsDetails(complaintsId: string) {
    return this._complaintsAction.getInfo(complaintsId);
  }

  deleteComplaints(complaintsId: string) {
    return this._complaintsAction.delete(complaintsId);
  }
}
