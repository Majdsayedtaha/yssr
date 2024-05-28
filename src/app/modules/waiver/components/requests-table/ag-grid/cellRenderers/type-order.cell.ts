import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

@Component({
  selector: 'type-order',
  template: `
    <div class="container-box box" *ngIf="params.value">
      {{ 'order_waiver' | translate }}
    </div>
    <div class="error-box box" *ngIf="!params.value">
      {{ 'order_worker' | translate }}
    </div>
  `,
  styles: [
    `
      .box {
        border-radius: 5px;
        height: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: max-content;
        padding: 0 1rem;
      }
      .container-box {
        background: rgba(21, 215, 161, 0.12);
        color: #15d7a1;
      }
      .error-box {
        background: rgba(234, 84, 85, 0.12);
        color: #ea5455;
      }
    `,
  ],
})
export class TypeOrderCell extends CoreBaseComponent implements ICellRendererAngularComp {
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
