import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community';

@Component({
  selector: 'app-text-filter',
  template: `
    <div class="filter-popup">
      <mat-form-field class="filter-field" [dir]="getDirection()">
        <input matInput type="text" />
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      .filter-popup {
        position: relative;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        width: 250px;
        height: 75px;
        background-color: #fff;
        padding: 0.5rem 1rem;
        border-radius: var(--button-radius);
        &::before {
          content: '';
          position: absolute;
          top: -19px;
          /* left: 50%; */
          left: 5%;
          transform: translate(-10px, 0px);
          border: 10px solid;
          border-top-color: transparent;
          border-bottom-color: var(--white);
          border-left-color: transparent;
          border-right-color: transparent;
        }
        .filter-field {
          transform: translate(-50%, -50%);
          position: absolute;
          left: 50%;
          top: 50%;
        }
        ::ng-deep {
          .mat-mdc-form-field-subscript-wrapper {
            display: none !important;
          }
        }
      }
    `,
  ],
})
export class TextFilterComponent extends CoreBaseComponent implements IFilterAngularComp {
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

  getModel() {}

  setModel(model: any) {}

  updateFilter() {
    this.params.filterChangedCallback();
  }
}
