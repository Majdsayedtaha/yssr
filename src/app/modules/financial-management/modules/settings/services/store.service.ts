import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreActions } from '../actions/store.action';
@Injectable({ providedIn: 'root' })
export class StoreService {
  private _storeActions: StoreActions;

  constructor(private _http: HttpClient) {
    this._storeActions = new StoreActions(_http);
  }

  addStore(newStore: any) {
    return this._storeActions.add(newStore);
  }

  updateStore(storeId: string, updatedStore: any) {
    return this._storeActions.put(storeId, updatedStore);
  }
  getStoreList(formParams: any) {
    return this._storeActions.get(formParams);
  }

  getStoreDetails(storeId: string) {
    return this._storeActions.getInfo(storeId);
  }
  getStoreSelect(formParams: any) {
    return this._storeActions.getStoreSelect(formParams);
  }

  deleteStore(storeId: string) {
    return this._storeActions.delete(storeId);
  }
}
