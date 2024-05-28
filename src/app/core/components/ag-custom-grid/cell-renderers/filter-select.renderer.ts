import { Component } from '@angular/core';
import { FilterTemplate } from './filter-template.renderer';
import { FormControl, FormGroup } from '@angular/forms';
import { AgPromise, IDoesFilterPassParams } from 'ag-grid-community';
import { AgFilterComponent } from 'ag-grid-angular';
@Component({
  selector: 'ag-filter-select-renderer',
  template: `
    <div class="filter-popup" [formGroup]="form">
      <mat-custom-field
        (onSearchableValueChange)="handleChanges($event)"
        [controlName]="field"
        label=""
        type="select"
        [group]="form"
        [callApiFunction]="params?.getOptions">
      </mat-custom-field>
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
        align-items: center;
        justify-content: center;
        width: 250px;
        min-height: 75px;
        background-color: #fff;
        padding: 0.5rem 1rem;
        border-radius: var(--button-radius);
        ::ng-deep {
          .mat-mdc-form-field-subscript-wrapper {
            display: none !important;
          }
        }
      }
    `,
  ],
})
export class FilterSelectRenderer extends FilterTemplate implements AgFilterComponent {
  agInit(params: any): void {
    this.init(params);
    this.form = new FormGroup({
      [this.field]: new FormControl(null),
    });
    super.ngOnInit();
  }

  doesFilterPass(_params: IDoesFilterPassParams<any>): boolean {
    return true;
  }

  override handleChanges(event: any) {
    const filterText = event.target.value;
    super.handleChanges(filterText);
  }

  getModel() {}

  setModel(model: any): void | AgPromise<void> {}
}
