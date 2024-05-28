import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { FormArray, FormGroup } from '@angular/forms';
interface CustomCellRendererParams extends ICellRendererParams {
  formGroup: FormGroup;
}

@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="editBusinessCase()">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteBusinessCase()">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class BusinessCaseActionCell implements ICellRendererAngularComp {
  public cell!: CustomCellRendererParams;

  get businessArray(): FormArray {
    return this.cell.formGroup.parent?.get('businessArr') as FormArray;
  }

  constructor() {}

  agInit(params: CustomCellRendererParams): void {
    this.cell = params;
  }

  refresh(params: CustomCellRendererParams): boolean {
    this.cell = params;
    return true;
  }

  editBusinessCase() {
    this.cell.formGroup.patchValue(this.cell.data);
    this.cell.context.parentComp.update = true;
  }

  deleteBusinessCase() {
    const index = this.businessArray?.value.findIndex((r: { id: string }) => r.id === this.cell.data.id);
    this.cell.api.applyTransaction({ remove: [this.cell.data] });
    this.businessArray.removeAt(index);
  }
}
