import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDevice } from '../models/device.interface';
import { DeviceActions } from '../actions/device.action';
@Injectable({ providedIn: 'root' })
export class DeviceService {
  private _deviceActions: DeviceActions;

  constructor(private _http: HttpClient) {
    this._deviceActions = new DeviceActions(_http);
  }

  addDevice(newDevice: IDevice) {
    return this._deviceActions.add(newDevice);
  }

  updateDevice(deviceId: string, updatedDevice: IDevice) {
    return this._deviceActions.put(deviceId, updatedDevice);
  }
  getDeviceList(formParams: any) {
    return this._deviceActions.get(formParams);
  }

  getDevicesSelect(formParams: any) {
    return this._deviceActions.getDevicesSelect(formParams);
  }
  deleteDevice(deviceId: string) {
    return this._deviceActions.delete(deviceId);
  }
}
