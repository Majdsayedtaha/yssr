import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

@Component({
  selector: 'checkbox-filter',
  template: `
    <div class="filter-popup">
      <mat-checkbox [dir]="getDirection()" class="f-weight-700 f-size-12" (ngModelChange)="updateFilter()">
        {{ 'checkbox.worker.leasing' | translate }}
      </mat-checkbox>
      <mat-checkbox [dir]="getDirection()" class="f-weight-700 f-size-12 border" (ngModelChange)="updateFilter()">
        {{ 'checkbox.worker.sponsor' | translate }}
      </mat-checkbox>
           <mat-checkbox [dir]="getDirection()" class="f-weight-700 f-size-12 border" (ngModelChange)="updateFilter()">
        {{ 'checkbox.worker.admission' | translate }}
      </mat-checkbox>
    </div>
  `,
  styles: [
    `
      .filter-popup {
        position: absolute;
        top: 0;
        left: -35px;
        display: flex;
        flex-direction: column;
        width: 100px;
        background-color: #fff;
        padding: 5px;
        border-radius: var(--button-radius);
        /* border: 1px solid var(--primary-color); */
        &::before {
          content: '';
          position: absolute;
          top: -19px;
          left: 50%;
          transform: translate(-10px, 0px);
          border: 10px solid;
          border-top-color: transparent;
          border-bottom-color: var(--white);
          border-left-color: transparent;
          border-right-color: transparent;
        }
        .border {
          border-top: 1px dotted var(--light-active-accent-color);
        }
      }
    `,
  ],
})
export class CheckboxFilterAgGridComponent extends CoreBaseComponent implements IFilterAngularComp {
  params!: IFilterParams;
  year: string = 'All';

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }

  agInit(params: IFilterParams): void {
    this.params = params;
  }

  isFilterActive(): boolean {
    return this.year === '2010';
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return params.data.year >= 2010;
  }

  getModel() { }

  setModel(model: any) { }

  updateFilter() {
    this.params.filterChangedCallback();
  }
}
