//Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesTableComponent } from './employees-table/employees-table.component';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { EmployeeFormComponent } from './employee-form/employee-form.component';

//Components

const routes: Routes = [
  {
    path: 'employees-table',
    title: AppRoutes.baseAppTitle + 'Employees Table',
    component: EmployeesTableComponent,
    data: {
      breadcrumb: 'label.employee.employees_table',
      roleAccessor: IRoleEnum.Setting,
      roleActions: [IRolePermissionsEnum.canView]
    },
  },
  {
    path: 'add-employee',
    title: AppRoutes.baseAppTitle + 'Add Employee',
    component: EmployeeFormComponent,
    data: {
      roleAccessor: IRoleEnum.Setting,
      roleActions: [IRolePermissionsEnum.canAdd],
      breadcrumb: 'label.employee.add_employee',
    },
  },
  {
    path: 'edit-employee/:id',
    title: AppRoutes.baseAppTitle + 'Edit Employee',
    component: EmployeeFormComponent,
    data: {
      roleAccessor: IRoleEnum.Setting,
      roleActions: [IRolePermissionsEnum.canUpdate],
      breadcrumb: 'label.employee.edit_employee',
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'employees-table',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule { }
