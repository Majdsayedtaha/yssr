import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

@Component({
  selector: 'app-dialog-sale-price',
  template: `
    <div class="form-section">
      <div class="section-card">
        <!-- Header -->
        <div class="toast-header bg-white p-1">
           <!-- BreadCrumb -->
           <nav-breadcrumb child="buttons.record"></nav-breadcrumb>
          <!-- Close -->
          <mat-icon svgIcon="close" class="c-pointer" (click)="closeDialog()"> </mat-icon>

        </div>
        <form [formGroup]="data.priceForm" *ngIf="data?.priceForm">
          <div class="row-flex-division">
            <mat-custom-field
              controlName="jobId"
              label="occupation"
              type="select"
              [selectValueAsObject]="true"
              [callApiFunction]="fetchAllJobsSearchableSelect"
              [group]="data.priceForm"></mat-custom-field>

            <mat-custom-field
              controlName="experienceTypeId"
              label="type_experience"
              type="select"
              [selectValueAsObject]="true"
              [callApiFunction]="fetchExperienceTypes"
              [group]="data.priceForm"></mat-custom-field>
          </div>
          <div class="row-flex-division">
            <!-- <mat-custom-field
              controlName="monthlySalary"
              label="setting.fields.salary"
              type="number"
              [group]="data.priceForm">
            </mat-custom-field> -->
            <mat-custom-field
              controlName="religionId"
              label="religion"
              type="select"
              [selectValueAsObject]="true"
              [callApiFunction]="fetchReligions"
              [group]="data.priceForm">
            </mat-custom-field>
            <mat-custom-field controlName="price" label="setting.fields.price" type="number" [group]="data.priceForm">
            </mat-custom-field>
          </div>
          <div class="footer d-flex">
            <button
              mat-raised-button
              color="primary"
              class="btn f-size-14 f-weight-500 btn-field-stander"
              [disabled]="!this.data.priceForm.valid"
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
              mat-stroked-button
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
        mat-icon{
          margin: 0 0.5rem;
        }
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
export class DialogSalePriceComponent extends CoreBaseComponent implements OnInit {
  constructor(
    @Inject(INJECTOR) injector: Injector,
    public dialogRef: MatDialogRef<DialogSalePriceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
