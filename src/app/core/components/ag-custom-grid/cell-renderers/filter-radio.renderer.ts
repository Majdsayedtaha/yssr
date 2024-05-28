import { Component } from '@angular/core';
import { FilterTemplate } from './filter-template.renderer';
import { FormControl, FormGroup } from '@angular/forms';
import { AgPromise, IDoesFilterPassParams } from 'ag-grid-community';
import { AgFilterComponent } from 'ag-grid-angular';

@Component({
  selector: 'ag-filter-radio',
  template: `
    <div class="filter-popup" [formGroup]="form">
      <mat-radio-group
        [formControlName]="field"
        class="d-c-flex"
        [dir]="core.getDirection()"
        (change)="handleChanges($event)">
        <mat-radio-button *ngFor="let option of options" [value]="option.value" color="primary">{{
          option.name | translate
        }}</mat-radio-button>
      </mat-radio-group>
    </div>
  `,
  styles: [
    `
      .filter-popup {
        background-color: #fff;
        padding: 0.5rem 0.2rem;
        width: -moz-fit-content;
        width: fit-content;
        max-height: 300px;
        overflow: scroll;
      }
      .d-c-flex {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
    `,
  ],
})
export class FilterRadioRenderer extends FilterTemplate implements AgFilterComponent {
  options = [{ name: 'all', value: null }];

  agInit(params: any): void {
    this.init(params);
    if (params.options) this.options.push(...params.options);
    else if (params.getOptions) {
      params.getOptions()?.subscribe((res: any) => {
        res.data.forEach((cv: any) => {
          this.options.push({ name: cv.name, value: cv.name });
        });
      });
    }
    this.form = new FormGroup({
      [this.field]: new FormControl(null),
    });
    super.ngOnInit();
  }

  doesFilterPass(_params: IDoesFilterPassParams<any>): boolean {
    return true;
  }

  getModel() {}

  setModel(model: any): void | AgPromise<void> {}
}
