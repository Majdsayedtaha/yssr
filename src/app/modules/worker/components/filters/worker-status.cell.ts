import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IWorker } from '../../models';

@Component({
  selector: 'app-worker-status',
  template: `
    <span class="recruitment-status" *ngIf="worker.cvType === Recruitment"> {{ worker.cvType }} </span>
    <span class="transport-status" *ngIf="worker.cvType === TransferOfSponsorship"> {{ worker.cvType }} </span>
    <span class="waiver-status" *ngIf="worker.cvType === Waiver"> {{ worker.cvType }} </span>
    <span class="rent-status" *ngIf="worker.cvType === Rent"> {{ worker.cvType }} </span>
  `,
  styles: [
    `
      .rent-status {
        background: rgba(21, 215, 161, 0.12);
        width: fit-content;
        padding: 3px 5px;
        border-radius: 5px;
        color: #15d7a1;
      }

      .recruitment-status {
        background: rgba(115, 103, 240, 0.2);
        width: fit-content;
        padding: 3px 5px;
        border-radius: 5px;
        color: #7367f0;
      }

      .transport-status {
        background: rgba(243, 193, 27, 0.15);
        width: fit-content;
        padding: 3px 5px;
        border-radius: 5px;
        color: #f3c11b;
      }

      .waiver-status {
        background: rgba(10, 220, 110, 0.15);
        width: fit-content;
        padding: 3px 5px;
        border-radius: 5px;
        color: white;
      }
    `,
  ],
})
export class WorkerStatusCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  worker!: IWorker;
  //TODO Should be Ids
  Recruitment = 'استقدام';
  TransferOfSponsorship = 'نقل كفالة';
  Waiver = 'تنازل';
  Rent = 'إيجار';

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.worker = this.params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }
}
