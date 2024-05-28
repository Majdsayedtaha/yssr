import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BranchManagerSelectAction } from '../actions/branch-manager-select.action';


@Injectable({ providedIn: 'root' })
export class BranchManagerSelectService {
  private _branchManagerSelectAction: BranchManagerSelectAction;

  constructor(private _http: HttpClient) {
    this._branchManagerSelectAction = new BranchManagerSelectAction(_http);
  }

  getBranchesManagersSelect() {
    return this._branchManagerSelectAction.getBranchesManagersSelect();
  }
}
