import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { AgreementPriceService } from '../../../services/agreement-price.service';

@Component({
  selector: 'app-dialog-sale-price',
  template: `
    <div class="form-section">
      <div class="section-card">
        <!-- Header -->
        <div class="toast-header bg-white p-1">
          <!-- BreadCrumb -->
          <nav-breadcrumb
            class="breadcrumb"
            [child]="!data.update ? 'buttons.record' : 'buttons.record_update'"></nav-breadcrumb>
          <!-- Close -->
          <mat-icon svgIcon="close" class="c-pointer icon" (click)="closeDialog()"> </mat-icon>
        </div>
        <form [formGroup]="data.priceForm" *ngIf="data?.priceForm">
          <div class="row-flex-division">
            <mat-custom-field
              controlName="jobId"
              label="field.office.career"
              [callApiFunction]="fetchAllJobsSearchableSelect"
              type="searchableSelect"
              [selectValueAsObject]="true"
              [group]="data.priceForm"></mat-custom-field>

            <mat-custom-field
              controlName="experienceTypeId"
              label="field.office.experience_type"
              [callApiFunction]="fetchExperienceTypes"
              [selectValueAsObject]="true"
              type="select"
              [group]="data.priceForm">
            </mat-custom-field>
          </div>
          <div class="row-flex-division">
            <mat-custom-field
              controlName="religionId"
              label="field.office.religion"
              [callApiFunction]="fetchReligions"
              [selectValueAsObject]="true"
              type="select"
              [group]="data.priceForm"></mat-custom-field>
            <mat-spinner
              class="spinner center-element"
              *ngIf="agreementPriceService.loadingExternalOfficePrice"
              [diameter]="30"></mat-spinner>
            <mat-custom-field
              controlName="recruitmentPeriod"
              label="field.office.recruitment_period"
              type="number"
              textSuffix="day"
              [minNumberValue]="0"
              [group]="data.priceForm">
            </mat-custom-field>
            <mat-custom-field
              controlName="agreementPrice"
              label="field.office.agreement_price"
              type="number"
              textSuffix="dollar"
              [group]="data.priceForm">
            </mat-custom-field>
          </div>
          <div class="footer d-flex">
            <button
              mat-raised-button
              color="primary"
              class="btn f-size-14 f-weight-500 btn-field-stander"
              [disabled]="data.priceForm.invalid"
              (click)="addRecord()"
              type="submit">
              <ng-container *ngIf="data.update">
                {{ 'buttons.update' | translate }}
              </ng-container>
              <ng-container *ngIf="!data.update">
                {{ 'buttons.add' | translate }}
              </ng-container>
            </button>
            <button
              mat-raised-button
              color="primary"
              class="btn f-size-14 f-weight-500 btn-field-stander"
              type="submit"
              (click)="closeDialog()">
              {{ 'buttons.cancel' | translate }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .breadcrumb {
          flex: 1;
        }
      }
      .form-section {
        width: 800px;
      }
      .btn {
        width: 110px !important;
      }
      .footer {
        margin-top: 1rem;
        justify-content: space-between;
      }
    `,
  ],
})
export class DialogAgreementPriceComponent extends CoreBaseComponent implements OnInit {
  constructor(
    @Inject(INJECTOR) injector: Injector,
    public dialogRef: MatDialogRef<DialogAgreementPriceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public agreementPriceService: AgreementPriceService
  ) {
    super(injector);
  }

  ngOnInit(): void {}

  addRecord() {
    this.dialogRef.close(this.data);
  }

  closeDialog() {
    this.dialogRef.close(null);
  }
}
