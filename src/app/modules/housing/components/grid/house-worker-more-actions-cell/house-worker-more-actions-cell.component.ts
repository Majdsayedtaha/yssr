import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { ICellRendererParams } from 'ag-grid-community';
import { FormGroup } from '@angular/forms';
import { IEnum } from 'src/app/core/interfaces';
import { IApartment } from '../../../models';
import { HousingFormComponent } from '../../housing-form/housing-form.component';

interface ApartmentCellRendererAngularComp extends ICellRendererParams {
  formGroup: FormGroup;
}

@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button type="button" (click)="edit()">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button type="button" (click)="delete()">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class HouseWorkerActionsCellComponent implements ICellRendererAngularComp {
  public cell!: ApartmentCellRendererAngularComp;
  public parentComponent!: HousingFormComponent;

  constructor() {}

  agInit(params: ApartmentCellRendererAngularComp): void {
    this.cell = params;
    this.parentComponent = this.cell.context.parentComp as HousingFormComponent;
  }

  refresh(params: ApartmentCellRendererAngularComp): boolean {
    this.cell = params;
    return true;
  }

  delete() {
    const idx = this.parentComponent.apartmentList.findIndex((el: IApartment) => el.id == this.cell.data.id);
    this.parentComponent.apartmentList.splice(idx, 1);
    this.cell.api.applyTransaction({ remove: [this.cell.data] });
    this.cell.formGroup.reset();
    this.parentComponent.isUpdatedApartment = false;
  }

  edit() {
    this.parentComponent.isUpdatedApartment = true;
    this.cell.formGroup.patchValue({
      id: this.cell.data.id,
      unitNumber: this.cell.data.unitNumber,
      roomsCount: this.cell.data.roomsCount,
      workerCapacity: this.cell.data.workerCapacity,
    });
    const formArray = this.cell.formGroup.get('supervisorsIds') as FormArray;
    this.cell.data.supervisors.forEach((supervisor: IEnum) => {
      formArray.push(new FormControl(supervisor));
    });
  }
}
