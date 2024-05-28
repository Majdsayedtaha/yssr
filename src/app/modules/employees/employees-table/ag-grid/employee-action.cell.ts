import { FormGroup } from '@angular/forms';
import { IRoleEnum } from 'src/app/core/constants';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { EmployeesService } from 'src/app/modules/employees/services/employee.service';
import { switchMap, of } from 'rxjs';
import { IToastData, ToastComponent } from 'src/app/core/components/toast/toast.component';
import { DialogService } from 'src/app/core/services/dialog.service';
import { Router } from '@angular/router';

interface CustomCellRendererParams extends ICellRendererParams {
  formGroup: FormGroup;
}

@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="editEmployee()">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteEmployee()">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class EmployeeActionCell extends CoreBaseComponent implements ICellRendererAngularComp {
  public cell!: CustomCellRendererParams;
  role = IRoleEnum.Employee;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _employeesService: EmployeesService,
    private _toast: DialogService,
    private _router: Router
  ) {
    super(injector);
  }

  agInit(params: CustomCellRendererParams): void {
    this.cell = params;
  }

  refresh(params: CustomCellRendererParams): boolean {
    this.cell = params;
    return true;
  }

  deleteEmployee() {
    const toastData: IToastData = {
      messageContent: 'you_want_to_delete_employee',
      firstButtonContent: 'back_table',
      secondButtonContent: 'yes_surely',
      svgIcon: 'laptop-toast',
      centralize: true,
    };
    this._toast
      .openDialog(ToastComponent, { data: toastData })
      .pipe(
        switchMap(res => {
          if (res) {
            return this._employeesService.deleteEmployee(this.cell.data.id);
          } else {
            return of(null);
          }
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.cell.api.applyTransaction({ remove: [this.cell.data] });
        }
      });
  }

  editEmployee() {
    this._router.navigateByUrl(`employees/edit-employee/${this.cell.data.id}`);
  }
}
