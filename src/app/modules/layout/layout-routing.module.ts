//Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Components
import { LayoutComponent } from './components/layout/layout.component';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { roleGuard } from 'src/app/core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dash-board',
        data: {
          breadcrumb: 'dash_board',
        },
        loadChildren: () => import('../main/main.module').then(m => m.MainModule),
      },
      // {
      //   path: 'home-page',
      //   data: {
      //     breadcrumb: 'main',
      //   },
      //   loadChildren: () => import('../home/home.module').then(m => m.HomeModule),
      // },
      {
        path: 'customers',
        data: {
          breadcrumb: 'label.customer.title',
          icon: 'customers-p',
        },
        loadChildren: () => import('../customers/customers.module').then(m => m.CustomersModule),
      },
      {
        path: 'contracts',
        data: {
          breadcrumb: 'label.contract.title',
          icon: 'Add-recruitment-contract',
        },
        loadChildren: () =>
          import('../recruitment-contracts/recruitment-contracts.module').then(m => m.RecruitmentContractsModule),
      },
      {
        path: 'workers',
        data: {
          breadcrumb: 'label.employment.title',
          icon: 'cv-p',
        },
        loadChildren: () => import('../worker/worker.module').then(m => m.WorkerModule),
      },
      {
        path: 'refund-management',
        data: {
          breadcrumb: 'label.refund.title',
          icon: 'refund-management-p',
        },
        loadChildren: () => import('../refund-management/refund-management.module').then(m => m.RefundManagementModule),
      },
      {
        path: 'rents',
        data: {
          breadcrumb: 'label.rent.title',
          icon: 'rent-p',
        },
        loadChildren: () => import('../rent/rent.module').then(m => m.RentModule),
      },
      {
        path: 'settings',
        data: {
          breadcrumb: 'label.setting.title',
          icon: 'System-settings-p',
        },

        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule),
      },
      {
        path: 'financial-management',
        data: {
          breadcrumb: 'financial_management',
          icon: 'financial-management-p',
        },
        loadChildren: () =>
          import('../financial-management/financial-management.module').then(m => m.FinancialManagementModule),
      },
      {
        path: 'branches',
        data: {
          breadcrumb: 'label.branch.title',
          icon: 'branch-p',
        },
        loadChildren: () => import('../branches/branches.module').then(m => m.BranchesModule),
      },
      {
        path: 'waivers',
        data: {
          breadcrumb: 'label.waiver.title',
          icon: 'waiver-p',
        },
        loadChildren: () => import('../waiver/waiver.module').then(m => m.WaiverModule),
      },
      {
        path: 'waivers-specifications',
        data: {
          breadcrumb: 'label.waiver-specifications.title',
          icon: 'waiver-p',
        },
        loadChildren: () =>
          import('../waiver-specifications/waiver-specifications.module').then(m => m.WaiverSpecificationsModule),
      },
      {
        path: 'surety-transfers',
        data: {
          breadcrumb: 'label.surety-transfer.title',
          icon: 'surety-transfer-p',
        },
        loadChildren: () => import('../surety-transfer/surety-transfer.module').then(m => m.SuretyTransferModule),
      },
      {
        path: 'delegations',
        data: {
          breadcrumb: 'electronic_authorization',
          icon: 'electronic-authorization-p',
        },
        loadChildren: () => import('../delegations/delegations.module').then(m => m.ElectronicAuthorizationModule),
      },
      {
        path: 'file',
        data: {
          breadcrumb: 'label.file.title',
          icon: 'office-p',
        },
        loadChildren: () => import('../file/file.module').then(m => m.FileModule),
      },
      {
        path: 'offices',
        data: {
          breadcrumb: 'label.offices.title',
          icon: 'office-p',
        },
        loadChildren: () => import('../offices/offices.module').then(m => m.OfficesModule),
      },
      {
        path: 'worker-benefits',
        data: {
          breadcrumb: 'worker_benefits',
          icon: 'credit-card',
        },
        loadChildren: () => import('../worker-benefits/worker-benefits.module').then(m => m.WorkerBenefitsModule),
      },
      {
        path: 'housing',
        data: {
          breadcrumb: 'label.housing.title',
          icon: 'housing-p',
        },
        loadChildren: () => import('../housing/housing.module').then(m => m.HousingModule),
      },
      {
        path: 'users',
        data: {
          breadcrumb: 'label.user.title',
          icon: 'customers-p',
        },
        loadChildren: () => import('../users/users.module').then(m => m.UsersModule),
      },
      // {
      //   path: 'employees',
      //   data: {
      //     breadcrumb: 'label.housing.title',
      //     icon: 'customers-p',
      //   },
      //   loadChildren: () => import('../employees/employees.module').then(m => m.EmployeesModule),
      // },
      {
        path: 'employees',
        title: AppRoutes.baseAppTitle + 'Employees',
        canActivate: [roleGuard],
        data: {
          breadcrumb: 'label.employee.employees_title',
          icon: 'customers-p',
          roleAccessor: IRoleEnum.Employee,
          roleActions: Object.values(IRolePermissionsEnum),
        },
        loadChildren: () => import('../employees/employees.module').then(m => m.EmployeesModule),
      },
      {
        path: 'managing-operations',
        title: AppRoutes.baseAppTitle + 'Managing Operations',
        canActivate: [roleGuard],
        data: {
          breadcrumb: 'label.managing_operations.title',
          icon: 'Managing-operations',
          roleAccessor: IRoleEnum.Employee,
          roleActions: Object.values(IRolePermissionsEnum),
        },
        loadChildren: () =>
          import('../managing-operations/managing-operations.module').then(m => m.ManagingOperationsModule),
      },
      {
        path: 'complaints',
        title: AppRoutes.baseAppTitle + 'Complaints',
        canActivate: [roleGuard],
        data: {
          breadcrumb: 'label.complaints.title',
          icon: 'rent-p',
          roleAccessor: IRoleEnum.Employee,
          roleActions: Object.values(IRolePermissionsEnum),
        },
        loadChildren: () => import('../complaints/complaints.module').then(m => m.ComplaintsModule),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dash-board',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
