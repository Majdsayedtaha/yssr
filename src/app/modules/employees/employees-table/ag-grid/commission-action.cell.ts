import { FormGroup } from '@angular/forms';
import { IRoleEnum } from 'src/app/core/constants';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { EmployeesService } from 'src/app/modules/employees/services/employee.service';

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
export class CommissionActionCell extends CoreBaseComponent implements ICellRendererAngularComp {
  public cell!: CustomCellRendererParams;
  role = IRoleEnum.Employee;

  constructor(@Inject(INJECTOR) injector: Injector, private _employeesService: EmployeesService) {
    super(injector);
  }

  agInit(params: CustomCellRendererParams): void {
    this.cell = params;
  }

  refresh(params: CustomCellRendererParams): boolean {
    this.cell = params;
    return true;
  }

  deleteCommission() {
    const commissionSections = this.cell.formGroup.get('commissionSections')?.value.slice();
    const index = commissionSections.findIndex((c: any) => {
      return c.id === this.cell.data.id;
    });
    if (index > -1) commissionSections.splice(index, 1);
    this.cell.formGroup.get('commissionSections')?.patchValue(commissionSections);
    this.cell.api.applyTransaction({ remove: [this.cell.data] });
    this.cell.context.parentComp.updateRow = false;
  }

  editCommission() {
    this.cell.api.refreshCells({ force: true });
    this.cell.formGroup.get('commissionSectionRow')?.patchValue({ ...this.cell.data });
    this.cell.context.parentComp.updateRow = true;
  }
}
