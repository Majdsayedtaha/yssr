import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ServicesService {

  constructor(private _http: HttpClient) {
  }

}
