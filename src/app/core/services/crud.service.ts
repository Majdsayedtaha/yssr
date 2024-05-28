import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPagination, IResponse } from '../models';

export class CRUDService<T, B = {}> {
  protected readonly apiURL: string;

  constructor(private http: HttpClient, protected readonly entityName: string) {
    this.apiURL = `${environment.baseURL}/${this.entityName}`;
  }

  protected createEntity(
    apiExtension: string,
    body?: T | FormData,
    showMessage: string = 'false',
    queryParams?: { [key: string]: string }
  ): Observable<IResponse<T>> {
    const params = new HttpParams({ fromObject: queryParams });
    const url = this.joinEntityUrl(apiExtension);
    return this.http.post<IResponse<T>>(url, body, { headers: { showMessage: showMessage }, params });
  }

  protected createEntityDownload(
    apiExtension: string,
    queryParams?: { [key: string]: string }
  ): Observable<ArrayBuffer> {
    const url = this.joinEntityUrl(apiExtension);
    const params = new HttpParams({ fromObject: queryParams });
    return this.http.get(url, { responseType: 'arraybuffer', params });
  }

  protected readPaginationEntities(
    apiExtension: string,
    queryParams?: { [key: string]: string }
  ): Observable<IResponse<IPagination<T, B>>> {
    const url = this.joinEntityUrl(apiExtension);
    if (queryParams) {
      let obj: any = { filterDto: JSON.stringify(queryParams) };
      const params = new HttpParams({ fromObject: obj });
      return this.http.get<IResponse<IPagination<T, B>>>(url, { params });
    } else {
      return this.http.get<IResponse<IPagination<T, B>>>(url);
    }
  }

  protected readEntities(apiExtension: string, query?: { [key: string]: string }): Observable<IResponse<T[]>> {
    const url = this.joinEntityUrl(apiExtension);
    if (!query || typeof query['query'] === 'undefined' || typeof query['page'] === 'undefined') {
      const params = new HttpParams({ fromObject: query });
      return this.http.get<IResponse<T[]>>(url, { params });
    } else {
      let obj: any;

      if (typeof query['page'] == 'string' && query['page'] !== '') {
        obj = {
          pageNumber: +query['page'],
          query: query['query'],
          // filterDto: JSON.stringify({ pageNumber: +query['page'], query: query['query'] }),
        };
        // delete query['page'];
      } else {
        obj = {
          query: query['query'],
          // filterDto: JSON.stringify({ pageNumber: +query['page'], query: query['query'] }),
        };
        // delete query['page'];
      }
      const params = new HttpParams({ fromObject: { ...obj, ...query } });
      return this.http.get<IResponse<T[]>>(url, { params });
    }
  }

  protected readEntity(apiExtension: string, id?: number | string, body?: T | FormData): Observable<IResponse<T>> {
    const url = this.joinEntityUrl(apiExtension, id);
    return this.http.get<IResponse<T>>(url);
    // let url = '';
    // id ? (url = this.joinEntityUrl(apiExtension, id)) : (url = this.joinEntityUrl(apiExtension));
    // if (body) return this.http.put<IResponse<T>>(url, body);
    // else return this.http.get<IResponse<T>>(url);
  }

  protected updateEntity(
    apiExtension: string,
    id?: number | string,
    body?: T | FormData,
    showMessage: string = 'false'
  ): Observable<IResponse<T>> {
    const url = id ? this.joinEntityUrl(apiExtension, id) : this.joinEntityUrl(apiExtension);
    return this.http.put<IResponse<T>>(url, body, { headers: { showMessage: showMessage } });
  }

  protected updateQueryEntity(apiExtension: string, query?: { [key: string]: string }): Observable<IResponse<T>> {
    const url = this.joinEntityUrl(apiExtension);
    const params = new HttpParams({ fromObject: query });
    return this.http.put<IResponse<T>>(url, params);
  }

  protected deleteEntity(
    apiExtension: string,
    id: number | string,
    query?: { [key: string]: string }
  ): Observable<IResponse<T>> {
    const url = this.joinEntityUrl(apiExtension, id);
    const params = new HttpParams({ fromObject: query });
    return this.http.delete<IResponse<T>>(url, { params });
  }

  private joinEntityUrl(apiExtension: string, id?: number | string): string {
    return id ? [this.apiURL, apiExtension, id].join('/') : [this.apiURL, apiExtension].join('/');
  }

  getListPutParams(apiExtension: string, body: any): Observable<IResponse<T>> {
    const url = this.joinEntityUrl(apiExtension);
    return this.http.put<IResponse<T>>(url, body);
  }
}
