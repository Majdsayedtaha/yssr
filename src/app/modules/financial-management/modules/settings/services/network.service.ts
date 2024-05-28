import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NetworkActions } from '../actions/network.action';
import { INetwork } from '../models/network.interface';
@Injectable({ providedIn: 'root' })
export class NetworkService {
  private _networkActions: NetworkActions;

  constructor(private _http: HttpClient) {
    this._networkActions = new NetworkActions(_http);
  }

  addNetwork(newNetwork: INetwork) {
    return this._networkActions.add(newNetwork);
  }

  updateNetwork(networkId: string, updatedNetwork: INetwork) {
    return this._networkActions.put(networkId, updatedNetwork);
  }
  getNetworkList(formParams: any) {
    return this._networkActions.get(formParams);
  }

  getNetworksSelect(formParams: any) {
    return this._networkActions.getNetworksSelect(formParams);
  }
  deleteNetwork(networkId: string) {
    return this._networkActions.delete(networkId);
  }
}
