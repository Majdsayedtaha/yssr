import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { SkillsComponent } from './components/skills/skills.component';
import { CareersComponent } from './components/careers/careers.component';
import { CountriesComponent } from './components/countries/countries.component';
import { PositionsComponent } from './components/positions/positions.component';
import { VisasTypesComponent } from './components/visas-types/visas-types.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { SalesPricesComponent } from './components/sales-prices/sales-prices.component';
import { SMSTemplateComponent } from './components/sms-template/sms-template.component';
import { SettingFormComponent } from './components/setting-form/setting-form.component';
import { SubServicesComponent } from './components/sub-services/sub-services.component';
import { RentalPricesComponent } from './components/rental-prices/rental-prices.component';
import { MainServicesComponent } from './components/main-services/main-services.component';
import { SkillActionCell } from './components/skills/ag-grid/custom-cell/skill-action.cell';
import { RegionsCitiesComponent } from './components/regions-cities/regions-cities.component';
import { EmailTemplateComponent } from './components/email-template/email-template.component';
import { VisaActionCell } from './components/visas-types/ag-grid/custom-cell/visa-action.cell';
import { CareerActionCell } from './components/careers/ag-grid/custom-cells/career-action.cell';
import { CitiesComponent } from './components/regions-cities/components/cities/cities.component';
import { CompanyPreviewComponent } from './components/company-preview/company-preview.component';
import { PositionActionCellComponent } from './components/positions/ag-grid/position-action.cell';
import { ArrivalAirportsComponent } from './components/arrival-airports/arrival-airports.component';
import { CountryActionCell } from './components/countries/ag-grid/custom-cells/country-action.cell';
import { RegionsComponent } from './components/regions-cities/components/regions/regions.component';
import { CompanyInfoFormComponent } from './components/company-info-form/company-info-form.component';
import { ExperiencesTypesComponent } from './components/experiences-types/experiences-types.component';
import { SalesPriceActionCell } from './components/sales-prices/agGrid/custom-cell/sales-price-action.cell';
import { RentalPriceActionCell } from './components/rental-prices/agGrid/custom-cell/rental-price-action.cell';
import { ExperienceActionCell } from './components/experiences-types/ag-grid/custom-cell/experiences-action.cell';
import { DialogPositionComponent } from './components/positions/dialog/dialog-position/dialog-position.component';
import { DialogSalePriceComponent } from './components/sales-prices/dialog-sale-price/dialog-sale-price.component';
import { DialogRentPriceComponent } from './components/rental-prices/dialog-rent-price/dialog-rent-price.component';
import { RecruitmentProceduresComponent } from './components/recruitment-procedures/recruitment-procedures.component';
import { NationalAddressComponent } from './components/company-info-form/national-address/national-address.component';
import { BasicInformationComponent } from './components/company-info-form/basic-information/basic-information.component';
import { ArrivalAirportActionCell } from './components/arrival-airports/ag-grid/custom-cell/arrival-airport-action.cell';
import { AdditionalDetailsComponent } from './components/company-info-form/additional-details/additional-details.component';
import { CitiesActionCell } from './components/regions-cities/components/cities/ag-grid/custom-cell/cities-action-more.cell';
import { RegionsActionCell } from './components/regions-cities/components/regions/ag-grid/custom-cell/regions-action-more.cell';
import { SMSTemplateActionCellComponent } from './components/sms-template/ag-grid/custom-cell/sms-template-action.cell.component';
import { EmailTemplateActionCellComponent } from './components/email-template/ag-grid/custom-cell/email-template-action.cell.component';
import { ResponsibleManagerInfoComponent } from './components/company-info-form/responsible-manager-info/responsible-manager-info.component';
import { RecruitmentProceduresActionCell } from './components/recruitment-procedures/ag-grid/custom-cell/recruitment-procedures-action.cell';
import { DialogSMSTemplateFormComponent } from './components/sms-template/toaster/dialog-sms-template-form/dialog-sms-template-form.component';
import { DialogEmailTemplateFormComponent } from './components/email-template/toaster/dialog-email-template-form/dialog-email-template-form.component';
import { MainServicesActionCell } from './components/main-services/ag-grid/custom-cell/main-services-action.cell';
import { SubServicesActionCell } from './components/sub-services/ag-grid/custom-cell/sub-services-action.cell';

@NgModule({
  declarations: [
    VisaActionCell,
    SkillsComponent,
    SkillActionCell,
    CitiesComponent,
    CareersComponent,
    CareerActionCell,
    RegionsComponent,
    CitiesActionCell,
    CountryActionCell,
    RegionsActionCell,
    CountriesComponent,
    VisasTypesComponent,
    SalesPricesComponent,
    ExperienceActionCell,
    SalesPriceActionCell,
    RentalPricesComponent,
    RentalPriceActionCell,
    RegionsCitiesComponent,
    EmailTemplateComponent,
    CompanyInfoFormComponent,
    ArrivalAirportsComponent,
    NationalAddressComponent,
    ArrivalAirportActionCell,
    DialogSalePriceComponent,
    DialogRentPriceComponent,
    ExperiencesTypesComponent,
    BasicInformationComponent,
    AdditionalDetailsComponent,
    RecruitmentProceduresComponent,
    ResponsibleManagerInfoComponent,
    RecruitmentProceduresActionCell,
    EmailTemplateActionCellComponent,
    DialogEmailTemplateFormComponent,
    SMSTemplateActionCellComponent,
    DialogSMSTemplateFormComponent,
    SMSTemplateComponent,
    PermissionsComponent,
    CompanyPreviewComponent,
    SettingFormComponent,
    PositionsComponent,
    DialogPositionComponent,
    PositionActionCellComponent,
    MainServicesComponent,
    MainServicesActionCell,
    SubServicesComponent,
    SubServicesActionCell,
  ],
  imports: [CommonModule, CoreModule, SettingsRoutingModule],
  providers: [DatePipe],
})
export class SettingsModule {}
