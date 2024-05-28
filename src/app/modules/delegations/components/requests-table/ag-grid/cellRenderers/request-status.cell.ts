import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

@Component({
  selector: 'elect-auth-request-status',
  template: `
    <div class="container-box" *ngIf="params.value">
      {{ 'authorized' | translate }}
    </div>
    <div class="error-box" *ngIf="!params.value">
      {{ 'not_authorized' | translate }}
    </div>
  `,
  styles: [
    `
      .container-box {
        border-radius: 5px;
        background: rgba(21, 215, 161, 0.12);
        color: #15d7a1;
        min-width: 100px;
        height: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .error-box {
        border-radius: 5px;
        background: rgba(234, 84, 85, 0.12);
        width: max-content;
        height: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ea5455;
        padding: 0 1rem;
      }
    `,
  ],
})
export class ElectronicAuthRequestStatusCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }
}
