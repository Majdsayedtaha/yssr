import { Component, inject } from '@angular/core';
import { FilterTemplate } from './filter-template.renderer';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgPromise, IDoesFilterPassParams } from 'ag-grid-community';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { startWith } from 'rxjs';
import { AgFilterComponent } from 'ag-grid-angular';

@UntilDestroy()
@Component({
  selector: 'ag-filter-range-date',
  template: `
    <div class="filter-popup">
      <mat-form-field appearance="outline" [dir]="core?.getDirection()" style="width:85%">
        <mat-date-range-input [formGroup]="form" [rangePicker]="picker">
          <input matStartDate formControlName="from" [placeholder]="'start-date' | translate" />
          <input matEndDate formControlName="to" [placeholder]="'end-date' | translate" />
        </mat-date-range-input>
        <mat-datepicker-toggle matIconPrefix [for]="picker"></mat-datepicker-toggle>
        <mat-icon
          svgIcon="x-icon"
          matIconSuffix
          (click)="form.get('from')?.value ? form.reset({ from: '', to: '' }) : ''"
          style="cursor: pointer; width:12px"></mat-icon>
        <mat-date-range-picker #picker>
          <mat-date-range-picker-actions>
            <button mat-button matDateRangePickerCancel>{{ 'buttons.cancel' | translate }}</button>
            <button mat-raised-button color="primary" matDateRangePickerApply>{{ 'buttons.apply' | translate }}</button>
          </mat-date-range-picker-actions>
        </mat-date-range-picker>
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
        align-items: center;
        flex-direction: column;
        justify-content: center;
        row-gap: 0.5em;
        column-gap: 0.5em;
        width: fit-content;
        min-height: 75px;
        background-color: #fff;
        padding: 1rem;
        border-radius: var(--button-radius);
        ::ng-deep {
          .mat-mdc-form-field-subscript-wrapper {
            display: none !important;
          }
          .mat-mdc-form-field-infix {
            width: auto !important;
          }
        }
        .filter-field {
          display: block;
        }
      }
      .d-flex {
        display: flex;
        align-items: center;
        column-gap: 0.5em;
      }
    `,
  ],
})
export class FilterRangeDateRenderer extends FilterTemplate implements AgFilterComponent {
  private _dateAdapter = inject(DateAdapter);
  private _translateService = inject(TranslateService);

  agInit(params: any): void {
    this.init(params);
    this.form = new FormGroup({
      from: new FormControl(''),
      to: new FormControl(''),
    });
    this._translateService.onLangChange
      .pipe(startWith({ lang: this._translateService.currentLang }))
      .subscribe(({ lang }) => {
        lang === 'ar' ? this._dateAdapter.setLocale('ar') : this._dateAdapter.setLocale('en');
      });
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(v => {
      super.handleChanges({ from: v.from, to: v.to });
      if ((v.from && v.to === '') || (v.from && v.to)) {
        this.form.get('to')?.addValidators(Validators.required);
        this.form.get('to')?.updateValueAndValidity({ emitEvent: false });
      } else if (v.from === '' && v.to === '') {
        this.form.get('to')?.removeValidators(Validators.required);
        this.form.get('to')?.updateValueAndValidity({ emitEvent: false });
      }
    });
    super.ngOnInit();
  }

  doesFilterPass(_params: IDoesFilterPassParams<any>): boolean {
    return true;
  }

  getModel() {}

  setModel(model: any): void | AgPromise<void> {}
}
