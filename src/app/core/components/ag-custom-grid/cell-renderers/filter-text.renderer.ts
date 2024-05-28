import { Component } from '@angular/core';
import { FilterTemplate } from './filter-template.renderer';
import { FormControl, FormGroup } from '@angular/forms';
import { AgPromise, IDoesFilterPassParams } from 'ag-grid-community';
import { AgFilterComponent } from 'ag-grid-angular';
@Component({
  selector: 'ag-filter-text-renderer',
  template: `
    <div class="filter-popup" [formGroup]="form">
      <mat-form-field [dir]="core?.getDirection()">
        <input
          matInput
          (input)="handleChanges($event)"
          [formControlName]="field"
          [placeholder]="'buttons.search' | translate"
          class="input-search" />
        <mat-icon
          svgIcon="x-icon"
          matIconSuffix
          (click)="form.get(this.field)?.value ? form.reset('') : ''"
          style="cursor: pointer; padding: 0px; width: 12px"></mat-icon>
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
        align-items: center;
        justify-content: center;
        background-color: #fff;
        padding: 0.5rem;
        border-radius: var(--button-radius);
        .input-search {
          border-bottom: 1px solid #898989;
        }
      }
    `,
  ],
})
export class FilterTextRenderer extends FilterTemplate implements AgFilterComponent {
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
