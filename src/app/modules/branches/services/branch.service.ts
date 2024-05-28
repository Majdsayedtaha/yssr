import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BranchActions } from '../actions/branch.action';
import { IBranch, IBranchForm } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BranchService {
  private _branchActions: BranchActions;
  sideBranchDetails = new BehaviorSubject<IBranchForm | null>(null);
  sideBranchManagerDetails = new BehaviorSubject<IBranch | null>(null);

  constructor(private _http: HttpClient) {
    this._branchActions = new BranchActions(_http);
  }

  addBranch(formParams: IBranchForm) {
    return this._branchActions.post(formParams);
  }
  getBranchesList(formParams: any) {
    return this._branchActions.get(formParams);
  }
  updateBranch(id: string, formData: IBranch) {
    return this._branchActions.put(id, formData);
  }
  getBranchInfo(id: string) {
    return this._branchActions.getInfo(id);
  }

  deleteBranch(id: string) {
    return this._branchActions.delete(id);
  }

  addBranchManager(formParams: IBranch) {
    return this._branchActions.postManager(formParams);
  }
  getBranchesManagerList(formParams: any) {
    return this._branchActions.getManager(formParams);
  }
  updateBranchManager(id: string, formData: IBranch) {
    return this._branchActions.putManager(id, formData);
  }
  getBranchManagerInfo(id: string) {
    return this._branchActions.getManagerInfo(id);
  }

  deleteBranchManager(id: string) {
    return this._branchActions.deleteManager(id);
  }
}
