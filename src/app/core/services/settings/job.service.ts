import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JobActions } from '../../actions/settings/job.actions';

@Injectable({ providedIn: 'root' })
export class JobService {
  private _jobActions: JobActions;

  constructor(private _http: HttpClient) {
    this._jobActions = new JobActions(_http);
  }

  createJob(formData: any): Observable<any> {
    return this._jobActions.add(formData);
  }

  jobData(value?: string, page?: number): Observable<any> {
    return this._jobActions.get(value, page);
  }
}
