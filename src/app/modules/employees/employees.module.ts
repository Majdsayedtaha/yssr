import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesTableComponent } from './employees-table/employees-table.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeActionCell } from './employees-table/ag-grid/employee-action.cell';
import { CommissionActionCell } from './employees-table/ag-grid/commission-action.cell';

@NgModule({
  declarations: [EmployeesTableComponent, EmployeeFormComponent, EmployeeActionCell, CommissionActionCell],
  imports: [CommonModule, CoreModule, EmployeesRoutingModule],
  providers: [DatePipe],
})
export class EmployeesModule {}
