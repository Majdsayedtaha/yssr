import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CRUDService } from "src/app/core/services/crud.service";

export class FileActions extends CRUDService<any> {

  constructor(http: HttpClient) {
    super(http, 'File');
  }

  get(formData: any): Observable<any> {
    return this.createEntityDownload('FillWordDocument', formData);
  }

  sanadCustomer(id: string): Observable<any> {
    return this.readEntity(`CustomerUnified/${id}`);
  }

  receivingWorker(Id: string): Observable<any> {
    return this.createEntityDownload(`WorkerUnified/${Id}`);
  }
}
