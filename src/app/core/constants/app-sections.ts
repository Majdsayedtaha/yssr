import { Sections } from '../interfaces/sections.interface';
import { IRoleEnum, IRolePermissionsEnum } from './enum';

export const TREE_DATA: Sections[] = [
  // Dashboard (لوحة التحكم)
  {
    name: 'dash_board',
    svg: 'waiver',
    route: 'dash-board',
    parent: true,
    roleShownAlways: true,
    children: [],
    // TODO Permissions
  },

  // Main (الرئيسية)
  // {
  //   name: 'main',
  //   svg: 'main',
  //   route: 'home-page',
  //   parent: true,
  //   roleShownAlways: true,
  //   children: [],
    // TODO Permissions
  // },

  // Recruitment Management (عقود الاستقدام)
  {
    name: 'recruitment_management',
    svg: 'recruitment',
    parent: true,
    value: IRoleEnum.RecruitmentContract,
    roleAuth: Object.keys(IRolePermissionsEnum),
    children: [
      {
        name: 'label.contract.table',
        route: 'contracts/table',
        value: IRoleEnum.RecruitmentContract,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.contract.add',
        route: 'contracts/add-contract',
        value: IRoleEnum.RecruitmentContract,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
      {
        name: 'label.contract.action',
        route: 'contracts/add-procedure',
        value: IRoleEnum.RecruitmentContract,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
      {
        name: 'label.recruitment.orders',
        route: 'contracts/orders',
        value: IRoleEnum.RecruitmentContract,
        roleAuth: IRolePermissionsEnum.canView,
      },
    ],
  },

  // Customer (العملاء)
  {
    name: 'customers',
    svg: 'customers',
    route: 'customers',
    parent: true,
    value: IRoleEnum.Customer,
    roleAuth: Object.keys(IRolePermissionsEnum),
    children: [
      {
        name: 'label.customer.table',
        route: 'customers/table',
        value: IRoleEnum.Customer,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.customer.add',
        route: 'customers/add',
        value: IRoleEnum.Customer,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
    ],
  },

  // Workers (السير الذاتية)
  {
    name: 'cvs',
    svg: 'cv',
    value: IRoleEnum.Worker,
    roleAuth: Object.keys(IRolePermissionsEnum),
    parent: true,
    children: [
      {
        name: 'label.employment.table',
        route: 'workers/table',
        value: IRoleEnum.Worker,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.employment.add',
        route: 'workers/add',
        value: IRoleEnum.Worker,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
    ],
  },

  // Refund Management (إدارة الرجيع)
  {
    name: 'refund_management',
    svg: 'refund-management',
    parent: true,
    roleShownAlways: true,
    value: IRoleEnum.ReturnRequest,
    roleAuth: Object.keys(IRolePermissionsEnum),
    children: [
      {
        name: 'label.order.title',
        route: 'refund-management/table',
        roleShownAlways: true,
        value: IRoleEnum.ReturnRequest,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.order.add',
        route: 'refund-management/add-order',
        roleShownAlways: true,
        value: IRoleEnum.ReturnRequest,
        roleAuth: [IRolePermissionsEnum.canAdd, IRolePermissionsEnum.canUpdate],
      },
      {
        name: 'label.order.action',
        route: 'refund-management/add-procedure',
        value: IRoleEnum.ReturnRequest,
        roleAuth: IRolePermissionsEnum.canAdd,
        roleShownAlways: true,
      },
    ],
  },

  // Rents (الإيجار)
  {
    name: 'rents',
    svg: 'rent',
    parent: true,
    value: IRoleEnum.RentRequest,
    roleAuth: Object.keys(IRolePermissionsEnum),
    children: [
      {
        name: 'label.contract.table',
        route: 'rents/table',
        value: IRoleEnum.RentRequest,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.contract.add',
        route: 'rents/add',
        value: IRoleEnum.RentRequest,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
      {
        name: 'label.contract.action',
        route: 'rents/procedure-add',
        value: IRoleEnum.RentRequest,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
      {
        name: 'label.contract.rent_workers',
        route: 'rents/rent-workers',
        value: IRoleEnum.RentRequest,
        roleAuth: IRolePermissionsEnum.canView,
      },
    ],
  },

  // Employment Benefits (استحقاقات العمالة)
  {
    name: 'employment_benefits',
    svg: 'employment-benefits',
    parent: true,
    value: IRoleEnum.WorkerBenefit,
    roleAuth: Object.keys(IRolePermissionsEnum),
    children: [
      {
        name: 'label.benefit.title',
        route: 'worker-benefits/table',
        value: IRoleEnum.WorkerBenefit,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.benefit.add',
        route: 'worker-benefits/add',
        value: IRoleEnum.WorkerBenefit,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
    ],
  },

  // Waiver (التنازل)
  {
    name: 'waiver',
    svg: 'waiver',
    parent: true,
    value: IRoleEnum.WaiverRequest,
    roleAuth: Object.keys(IRolePermissionsEnum),
    children: [
      {
        name: 'label.waiver.table',
        route: 'waivers/table',
        value: IRoleEnum.WaiverRequest,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.waiver.add_waiver',
        route: 'waivers/add-request-waiver',
        value: IRoleEnum.WaiverRequest,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
      {
        name: 'label.waiver.add_worker',
        route: 'waivers/add-request-worker',
        value: IRoleEnum.WaiverRequest,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
      {
        name: 'label.waiver.add_procedure',
        route: 'waivers/add-procedure',
        value: IRoleEnum.WaiverRequest,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
    ],
  },

  // Waiver Specifications
  //  {
  //    name: 'waivers-specifications',
  //    svg: 'waiver',
  //    parent: true,
  //    value: IRoleEnum.WaiverRequest,
  //    roleAuth: Object.keys(IRolePermissionsEnum),
  //    children: [
  //      { name: 'label.waiver-specifications.table', route: 'waivers-specifications/table', value: IRoleEnum.WaiverRequest, roleAuth: IRolePermissionsEnum.canView },
  //    ],
  //  },

  // Surety Transfer (نقل الكفالة)
  {
    name: 'label.surety-transfer.title',
    svg: 'surety-transfer',
    parent: true,
    value: IRoleEnum.SponsorshipTransfer,
    roleAuth: Object.keys(IRolePermissionsEnum),
    children: [
      {
        name: 'label.order.completed',
        route: 'surety-transfers/completed-orders',
        value: IRoleEnum.SponsorshipTransfer,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.order.without_employment',
        route: 'surety-transfers/completed-orders',
        queryParams: { employment: true },
        value: IRoleEnum.SponsorshipTransfer,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.order.add',
        route: 'surety-transfers/add-order',
        value: IRoleEnum.SponsorshipTransfer,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
    ],
  },

  // E-Delegations (التفاويض الالكترونية)
  {
    name: 'electronic_authorization',
    svg: 'electronic-authorization',
    parent: true,
    value: IRoleEnum.DelegationRequest,
    roleAuth: Object.keys(IRolePermissionsEnum),
    children: [
      {
        name: 'label.order.title',
        route: 'delegations/table',
        value: IRoleEnum.DelegationRequest,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.order.add',
        route: 'delegations/add-request',
        value: IRoleEnum.DelegationRequest,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
    ],
  },

  // Housing (الإيواء)
  {
    name: 'housing',
    svg: 'housing',
    parent: true,
    value: IRoleEnum.Housing,
    roleAuth: Object.keys(IRolePermissionsEnum),
    children: [
      {
        name: 'label.residence.title',
        route: 'housing/table',
        value: IRoleEnum.Housing,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.residence.add',
        route: 'housing/add',
        value: IRoleEnum.Housing,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
      {
        name: 'label.residence.employee',
        route: 'housing/employee-add',
        value: IRoleEnum.Housing,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
    ],
  },

  // Employees (الموظفين)
  {
    name: 'label.employee.employees_title',
    roleShownAlways: true,
    parent: true,
    svg: 'customers',
    children: [
      {
        name: 'label.employee.employees_table',
        roleShownAlways: true,
        route: 'employees/employees-table',
      },
      {
        name: 'label.employee.add_employee',
        roleShownAlways: true,
        route: 'employees/add-employee',
      },
    ],
  },

  // Operations Management (إدارة العمليات)
  {
    name: 'label.managing_operations.title',
    svg: 'managing-operations',
    parent: true,
    roleShownAlways: true,
    children: [
      {
        name: 'label.managing_operations.project_table',
        roleShownAlways: true,
        route: 'managing-operations/project-table',
      },
      {
        name: 'label.managing_operations.tasks_table',
        roleShownAlways: true,
        route: 'managing-operations/tasks-table',
      },
      {
        name: 'label.managing_operations.my_tasks',
        roleShownAlways: true,
        route: 'managing-operations/my-tasks',
      },
    ],
    // TODO Permissions
  },

  // General Account
  // {
  //   name: 'general_accounts',
  //   svg: 'general-accounts',
  //   parent: true,
  //   roleShownAlways: true,
  //   children: [],
  // },

  // External Site
  // {
  //   name: 'external_site',
  //   svg: 'external-site',
  //   parent: true,
  //   roleShownAlways: true,
  //   children: [{ name: 'label.order.customer_tracking', roleShownAlways: true }],
  // },

  // Financial Management (الإدارة المالية)
  {
    name: 'financial_management',
    svg: 'financial-management',
    parent: true,
    roleShownAlways: true,
    children: [
      {
        name: 'label.financial.sales',
        roleShownAlways: true,
        parent: true,
        children: [
          {
            name: 'label.financial.add_bill',
            roleShownAlways: true,
            route: 'financial-management/sales/add-bill',
          },
          {
            name: 'label.financial.table_bill',
            roleShownAlways: true,
            route: 'financial-management/sales/bills-table',
          },
        ],
      },
      {
        name: 'label.financial.sales_rebound',
        roleShownAlways: true,
        parent: true,
        children: [
          {
            name: 'label.financial.add_bill',
            roleShownAlways: true,
            route: 'financial-management/sales-rebound/add-bill',
          },
          {
            name: 'label.financial.table_bill',
            roleShownAlways: true,
            route: 'financial-management/sales-rebound/bills-table',
          },
        ],
      },
      {
        name: 'label.financial.receipt',
        roleShownAlways: true,
        parent: true,
        children: [
          {
            name: 'label.financial.add_document',
            roleShownAlways: true,
            route: 'financial-management/receipt/add-document',
          },
          {
            name: 'label.financial.table_document',
            roleShownAlways: true,
            route: 'financial-management/receipt/documents-table',
          },
        ],
      },
      {
        name: 'label.financial.bills_exchange',
        roleShownAlways: true,
        parent: true,
        children: [
          {
            name: 'label.financial.add_document',
            roleShownAlways: true,
            route: 'financial-management/bills-exchange/add-document',
          },
          {
            name: 'label.financial.table_document',
            roleShownAlways: true,
            route: 'financial-management/bills-exchange/documents-table',
          },
        ],
      },
      {
        name: 'label.financial.purchases',
        roleShownAlways: true,
        parent: true,
        children: [
          {
            name: 'label.financial.add_bill',
            roleShownAlways: true,
            route: 'financial-management/purchases/add-bill',
          },
          {
            name: 'label.financial.table_bill',
            roleShownAlways: true,
            route: 'financial-management/purchases/bills-table',
          },
        ],
      },
      {
        name: 'label.financial.purchases_rebound',
        roleShownAlways: true,
        parent: true,
        children: [
          {
            name: 'label.financial.add_bill',
            roleShownAlways: true,
            route: 'financial-management/purchases-rebound/add-bill',
          },
          {
            name: 'label.financial.table_bill',
            roleShownAlways: true,
            route: 'financial-management/purchases-rebound/bills-table',
          },
        ],
      },
      {
        name: 'label.financial.financial_movements',
        roleShownAlways: true,
        parent: true,
        children: [
          {
            name: 'label.financial.add_movement',
            roleShownAlways: true,
            route: 'financial-management/financial-movements/add-movement',
          },
          {
            name: 'label.financial.table_movement',
            roleShownAlways: true,
            route: 'financial-management/financial-movements/table-movements',
          },
        ],
      },
      {
        name: 'label.financial.settings',
        roleShownAlways: true,
        parent: true,
        children: [
          {
            name: 'label.financial.storage',
            roleShownAlways: true,
            route: 'financial-management/settings/storage',
          },
          {
            name: 'label.financial.banks',
            roleShownAlways: true,
            route: 'financial-management/settings/banks',
          },
          {
            name: 'label.financial.device',
            roleShownAlways: true,
            route: 'financial-management/settings/devices',
          },
          {
            name: 'label.financial.network',
            roleShownAlways: true,
            route: 'financial-management/settings/networks',
          },
          {
            name: 'label.financial.expense',
            roleShownAlways: true,
            route: 'financial-management/settings/expense-types',
          },
        ],
      },
    ],
    // TODO Permissions
  },

  // System Settings
  {
    name: 'system_settings',
    svg: 'System-settings',
    parent: true,
    value: IRoleEnum.Setting,
    roleAuth: Object.keys(IRolePermissionsEnum),
    children: [
      {
        name: 'label.setting.company',
        route: 'settings/company-info',
        value: IRoleEnum.Company,
        roleAuth: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canAdd],
      },

      {
        name: 'label.setting.careers',
        route: 'settings/careers/add',
        value: IRoleEnum.Job,
        roleAuth: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canAdd],
      },
      {
        name: 'label.setting.countries',
        route: 'settings/countries',
        value: IRoleEnum.Country,
        roleAuth: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canAdd],
      },
      {
        name: 'label.setting.regions_cities',
        route: 'settings/regions-cities',
        value: IRoleEnum.Region,
        roleAuth: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canAdd],
      },
      {
        name: 'label.setting.skills',
        route: 'settings/skills',
        value: IRoleEnum.Skill,
        roleAuth: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canAdd],
      },
      {
        name: 'label.setting.visa',
        route: 'settings/visas',
        value: IRoleEnum.VisaType,
        roleAuth: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canAdd],
      },
      {
        name: 'label.setting.airport',
        route: 'settings/arrival-airports',
        value: IRoleEnum.ArrivalStation,
        roleAuth: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canAdd],
      },
      {
        name: 'label.setting.type_experience',
        route: 'settings/experiences',
        value: IRoleEnum.ExperienceType,
        roleAuth: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canAdd],
      },

      {
        name: 'label.setting.recruitment_procedures',
        route: 'settings/recruitment-procedures',
        value: IRoleEnum.Procedure,
        roleAuth: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canAdd],
      },
      {
        name: 'label.setting.sales_prices',
        route: 'settings/sales-prices',
        value: IRoleEnum.SalePrice,
        roleAuth: 'canView',
      },
      {
        name: 'label.setting.rental_prices',
        route: 'settings/rental-prices',
        value: IRoleEnum.RentSalePrice,
        roleAuth: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canAdd],
      },
      {
        name: 'label.setting.email_templates',
        route: 'settings/email-templates',
        value: IRoleEnum.Template,
        roleAuth: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canAdd],
      },
      {
        name: 'label.setting.sms_templates',
        route: 'settings/sms-templates',
        value: IRoleEnum.Template,
        roleAuth: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canAdd],
      },
      {
        name: 'label.setting.positions',
        route: 'settings/positions',
        value: IRoleEnum.Setting,
        isAdmin: true,
        roleAuth: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canAdd],
      },
      {
        name: 'label.setting.permissions',
        route: 'settings/permissions',
        value: IRoleEnum.Setting,
        isAdmin: true,
        roleAuth: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canAdd],
      },
      {
        name: 'label.setting.notifications',
        route: 'settings/notifications/form',
        value: IRoleEnum.Setting,
        isAdmin: true,
        roleAuth: [IRolePermissionsEnum.canView, IRolePermissionsEnum.canAdd],
      },
      {
        name: 'label.setting.service.title',
        parent: true,
        isAdmin: true,
        children: [
          {
            name: 'label.setting.service.main_title',
            isAdmin: true,
            route: 'settings/services/main',
          },
          {
            name: 'label.setting.service.sub_title',
            isAdmin: true,
            route: 'settings/services/sub',
          },
        ],
        // TODO Permissions
      },
    ],
  },

  // Print & Export files (طباعة و تصدير الملفات)
  {
    name: 'file_exports',
    svg: 'print-b',
    parent: true,
    isAdmin: true,
    value: IRoleEnum.Setting,
    roleAuth: IRolePermissionsEnum.canView,
    children: [
      {
        name: 'label.file.acceptance',
        route: 'file/acceptance',
        value: IRoleEnum.Setting,
        isAdmin: true,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.file.contingency',
        route: 'file/contingency',
        value: IRoleEnum.Setting,
        isAdmin: true,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.file.info',
        route: 'file/info',
        value: IRoleEnum.Setting,
        isAdmin: true,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.file.medical',
        route: 'file/medical',
        value: IRoleEnum.Setting,
        isAdmin: true,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.file.runaway',
        route: 'file/runaway',
        value: IRoleEnum.Setting,
        isAdmin: true,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.file.affidavit',
        route: 'file/affidavit',
        value: IRoleEnum.Setting,
        isAdmin: true,
        roleAuth: IRolePermissionsEnum.canView,
      },
    ],
    // TODO Permissions
  },

  // Offices (المكاتب)
  {
    name: 'label.offices.title',
    svg: 'office',
    parent: true,
    value: IRoleEnum.ExternalOffice,
    roleAuth: Object.keys(IRolePermissionsEnum),
    children: [
      {
        name: 'label.offices.table',
        route: 'offices/external-offices',
        value: IRoleEnum.ExternalOffice,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.offices.add',
        route: 'offices/add-external-office',
        value: IRoleEnum.ExternalOffice,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
      {
        name: 'label.offices.user',
        route: 'offices/external-office-users',
        value: IRoleEnum.ExternalOfficeUser,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
      {
        name: 'label.offices.price',
        route: 'offices/office-agreements-prices',
        value: IRoleEnum.AgreementPrice,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
    ],
  },

  // Branches (الأفرع)
  {
    name: 'label.branch.title',
    svg: 'branch',
    parent: true,
    value: IRoleEnum.Branch,
    roleAuth: Object.keys(IRolePermissionsEnum),
    children: [
      {
        name: 'label.branch.table',
        route: 'branches/table',
        value: IRoleEnum.Branch,
        roleAuth: IRolePermissionsEnum.canView,
      },
      {
        name: 'label.branch.add',
        route: 'branches/add-branch',
        value: IRoleEnum.Branch,
        roleAuth: IRolePermissionsEnum.canAdd,
      },
    ],
  },

  // System Users (مستخدمي النظام)
  {
    name: 'label.user.title',
    svg: 'customers',
    parent: true,
    roleAuth: IRolePermissionsEnum.canView,
    isAdmin: true,
    value: IRoleEnum.Setting,
    children: [
      {
        name: 'label.user.table',
        route: 'users/table',
        value: IRoleEnum.Setting,
        roleAuth: IRolePermissionsEnum.canView,
        isAdmin: true,
      },
      {
        name: 'label.user.add',
        route: 'users/add-user',
        value: IRoleEnum.Setting,
        roleAuth: IRolePermissionsEnum.canView,
        isAdmin: true,
      },
    ],
    // TODO Permissions
  },

  // Complaints (الشكاوي)
  {
    name: 'label.complaints.title',
    svg: 'rent',
    parent: true,
    roleShownAlways: true,
    route: 'complaints',
    children: [],
    // TODO Permissions
  },
];
