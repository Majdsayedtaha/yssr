//Module
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
//Components
import { roleGuard } from 'src/app/core/guards/role.guard';
import { SkillsComponent } from './components/skills/skills.component';
import { CareersComponent } from './components/careers/careers.component';
import { CountriesComponent } from './components/countries/countries.component';
import { VisasTypesComponent } from './components/visas-types/visas-types.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { SalesPricesComponent } from './components/sales-prices/sales-prices.component';
import { SMSTemplateComponent } from './components/sms-template/sms-template.component';
import { RentalPricesComponent } from './components/rental-prices/rental-prices.component';
import { RegionsCitiesComponent } from './components/regions-cities/regions-cities.component';
import { EmailTemplateComponent } from './components/email-template/email-template.component';
import { ArrivalAirportsComponent } from './components/arrival-airports/arrival-airports.component';
import { CompanyInfoFormComponent } from './components/company-info-form/company-info-form.component';
import { ExperiencesTypesComponent } from './components/experiences-types/experiences-types.component';
import { RecruitmentProceduresComponent } from './components/recruitment-procedures/recruitment-procedures.component';
import { CompanyPreviewComponent } from './components/company-preview/company-preview.component';
import { SettingFormComponent } from './components/setting-form/setting-form.component';
import { PositionsComponent } from './components/positions/positions.component';
import { MainServicesComponent } from './components/main-services/main-services.component';
import { SubServicesComponent } from './components/sub-services/sub-services.component';

const routes: Routes = [
  {
    path: 'notifications/form',
    title: AppRoutes.baseAppTitle + 'Settings Information',
    component: SettingFormComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.notifications',
      roleAccessor: IRoleEnum.Setting,
      roleActions: [IRolePermissionsEnum.canUpdate, IRolePermissionsEnum.canView],
    },
  },
  {
    path: 'company-preview',
    title: AppRoutes.baseAppTitle + 'Company Information',
    component: CompanyPreviewComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.company',
      roleAccessor: IRoleEnum.Company,
      roleActions: [IRolePermissionsEnum.canView],
    },
  },
  {
    path: 'company-info',
    title: AppRoutes.baseAppTitle + 'Company Information',
    component: CompanyInfoFormComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.company',
      roleAccessor: IRoleEnum.Company,
      roleActions: [IRolePermissionsEnum.canUpdate],
    },
  },
  {
    path: 'careers/add',
    title: AppRoutes.baseAppTitle + 'Career Add',
    component: CareersComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.careers',
      roleAccessor: IRoleEnum.Job,
      roleActions: Object.values(IRolePermissionsEnum),
    },
  },
  {
    path: 'careers/update',
    title: AppRoutes.baseAppTitle + 'Career Update',
    component: CareersComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.careers',
      roleAccessor: IRoleEnum.Job,
      roleActions: Object.values(IRolePermissionsEnum),
    },
  },
  {
    path: 'countries',
    title: AppRoutes.baseAppTitle + 'Countries',
    component: CountriesComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.countries',
      roleAccessor: IRoleEnum.Country,
      roleActions: Object.values(IRolePermissionsEnum),
    },
  },
  {
    path: 'regions-cities',
    title: AppRoutes.baseAppTitle + 'regions&cities',
    component: RegionsCitiesComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.regions_cities',
      roleAccessor: IRoleEnum.Region,
      roleActions: Object.values(IRolePermissionsEnum),
    },
  },
  {
    path: 'skills',
    title: AppRoutes.baseAppTitle + 'Skills',
    component: SkillsComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.skills',
      roleAccessor: IRoleEnum.Skill,
      roleActions: Object.values(IRolePermissionsEnum),
    },
  },
  {
    path: 'visas',
    title: AppRoutes.baseAppTitle + 'Visas',
    component: VisasTypesComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.visa',
      roleAccessor: IRoleEnum.VisaType,
      roleActions: Object.values(IRolePermissionsEnum),
    },
  },
  {
    path: 'arrival-airports',
    title: AppRoutes.baseAppTitle + 'Arrival Airports',
    component: ArrivalAirportsComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.airport',
      roleAccessor: IRoleEnum.ArrivalStation,
      roleActions: Object.values(IRolePermissionsEnum),
    },
  },
  {
    path: 'experiences',
    title: AppRoutes.baseAppTitle + 'Experience',
    component: ExperiencesTypesComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.type_experience',
      roleAccessor: IRoleEnum.ExperienceType,
      roleActions: Object.values(IRolePermissionsEnum),
    },
  },
  {
    path: 'recruitment-procedures',
    title: AppRoutes.baseAppTitle + 'Recruitment Procedures',
    component: RecruitmentProceduresComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.recruitment_procedures',
      roleAccessor: IRoleEnum.Procedure,
      roleActions: Object.values(IRolePermissionsEnum),
    },
  },
  {
    path: 'sales-prices',
    title: AppRoutes.baseAppTitle + 'Sales Prices',
    component: SalesPricesComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.sales_prices',
      roleAccessor: IRoleEnum.SalePrice,
      roleActions: Object.values(IRolePermissionsEnum),
    },
  },
  {
    path: 'rental-prices',
    title: AppRoutes.baseAppTitle + 'Rental Prices',
    component: RentalPricesComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.rental_prices',
      roleAccessor: IRoleEnum.RentSalePrice,
      roleActions: Object.values(IRolePermissionsEnum),
    },
  },
  {
    path: 'email-templates',
    title: AppRoutes.baseAppTitle + 'Email Templates',
    component: EmailTemplateComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.email_templates',
      roleAccessor: IRoleEnum.Template,
      roleActions: Object.values(IRolePermissionsEnum),
    },
  },
  {
    path: 'sms-templates',
    title: AppRoutes.baseAppTitle + 'SMS Templates',
    component: SMSTemplateComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.sms_templates',
      roleAccessor: IRoleEnum.Template,
      roleActions: Object.values(IRolePermissionsEnum),
    },
  },
  {
    path: 'positions',
    title: AppRoutes.baseAppTitle + 'Positions',
    component: PositionsComponent,
    canActivate: [roleGuard],
    data: {
      breadcrumb: 'label.setting.positions',
      roleAccessor: IRoleEnum.Template,
      roleActions: Object.values(IRolePermissionsEnum),
    },
  },
  {
    path: 'permissions',
    title: AppRoutes.baseAppTitle + 'Permissions',
    component: PermissionsComponent,

    data: {
      breadcrumb: 'label.setting.permissions',
      roleAccessor: IRoleEnum.Setting,
      roleActions: Object.values(IRolePermissionsEnum),
    },
  },
  {
    path: 'services/main',
    title: AppRoutes.baseAppTitle + 'Main Services',
    component: MainServicesComponent,

    data: {
      breadcrumb: 'label.setting.service.main_title',
    },
    //TODO need Permission
  },
  {
    path: 'services/sub',
    title: AppRoutes.baseAppTitle + 'Sub Services',
    component: SubServicesComponent,

    data: {
      breadcrumb: 'label.setting.service.sub_title',
    },
    //TODO need Permission
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'company-info',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
