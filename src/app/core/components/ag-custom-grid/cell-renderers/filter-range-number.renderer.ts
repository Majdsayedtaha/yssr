import { Component } from '@angular/core';
import { FilterTemplate } from './filter-template.renderer';
import { FormControl, FormGroup } from '@angular/forms';
import { AgPromise, IDoesFilterPassParams } from 'ag-grid-community';
import { AgFilterComponent } from 'ag-grid-angular';

@Component({
  selector: 'ag-filter-range-number',
  template: `
    <div class="filter-popup" [formGroup]="form">
      <mat-form-field [dir]="core.getDirection()" class="filter-field">
        <input
          matInput
          [placeholder]="'enter-from-value' | translate"
          type="number"
          formControlName="from"
          class="input-search"
          (input)="handleChanges($event)" />
        <mat-icon
          svgIcon="x-icon"
          matIconSuffix
          (click)="form.get('from')?.value ? form.get('from')?.reset('') : ''"
          style="cursor: pointer; padding: 0px; width: 12px"></mat-icon>
      </mat-form-field>
      <mat-form-field [dir]="core.getDirection()" class="filter-field">
        <input
          matInput
          [placeholder]="'enter-to-value' | translate"
          type="number"
          formControlName="to"
          class="input-search"
          (input)="handleChanges($event)" />
        <mat-icon
          svgIcon="x-icon"
          matIconSuffix
          (click)="form.get('to')?.value ? form.get('to')?.reset('') : ''"
          style="cursor: pointer; padding: 0px; width: 12px"></mat-icon>
      </mat-form-field>
      <!-- <button mat-stroked-button color="accent" (click)="form.reset({ from: '', to: '' })">
        {{ 'reset' | translate }}
      </button> -->
    </div>
  `,
  styles: [
    `
      .filter-popup {
        position: relative;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        flex-direction: column;
        column-gap: 0.5em;
        row-gap: 0.5em;
        width: 250px;
        min-height: 75px;
        background-color: #fff;
        padding: 0.5rem 1rem;
        border-radius: var(--button-radius);
        .input-search {
          border-bottom: 1px solid #898989;
        }
      }
    `,
  ],
})
export class FilterRangeNumberRenderer extends FilterTemplate implements AgFilterComponent {
  agInit(params: any): void {
    this.init(params);
    this.form = new FormGroup({
      from: new FormControl(''),
      to: new FormControl(''),
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
