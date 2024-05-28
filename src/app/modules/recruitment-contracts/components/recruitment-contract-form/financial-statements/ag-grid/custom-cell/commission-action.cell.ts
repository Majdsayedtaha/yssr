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
      <button mat-icon-button (click)="editCommission()">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteCommission()">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class CommissionActionCell implements ICellRendererAngularComp {
  public cell!: CustomCellRendererParams;

  get employeesArray(): FormArray {
    return this.cell.formGroup?.get('employees') as FormArray;
  }

  constructor() {}

  agInit(params: CustomCellRendererParams): void {
    this.cell = params;
  }

  refresh(params: CustomCellRendererParams): boolean {
    this.cell = params;

    return true;
  }

  editCommission() {
    this.cell.formGroup.patchValue({ employee: this.cell.data.employeeId, amount: this.cell.data.amount });
    this.cell.context.parentComp.update = true;
  }

  deleteCommission() {
    const index = this.employeesArray?.value.findIndex(
      (emp: { employeeId: string }) => emp.employeeId === this.cell.data.id
    );
    this.cell.api.applyTransaction({ remove: [this.cell.data] });
    this.employeesArray.removeAt(index);
  }
}
