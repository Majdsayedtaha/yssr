import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IRent } from '../../models/rent.interface';

@Component({
  selector: 'app-request-status',
  template: `
    <span class="green-status" *ngIf="rent.requestStatus === INPROGRESS"> {{ rent.requestStatus }} </span>
    <span class="blue-status" *ngIf="rent.requestStatus === LATE_REQUEST"> {{ rent.requestStatus }} </span>
    <span class="blue-status" *ngIf="rent.requestStatus === PENDING"> {{ rent.requestStatus }} </span>
    <span class="yellow-status" *ngIf="rent.requestStatus === CLOSED"> {{ rent.requestStatus }} </span>
    <span class="red-status" *ngIf="rent.requestStatus === CANCELED"> {{ rent.requestStatus }} </span>
  `,
  styles: [],
})
export class RequestStatusCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  rent!: IRent;

  //TODO Should be Ids
  INPROGRESS = 'In progress';
  LATE_REQUEST = 'Late request';
  PENDING = 'Pending';
  CLOSED = 'Closed';
  CANCELED = 'Canceled';

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.rent = this.params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }
}
