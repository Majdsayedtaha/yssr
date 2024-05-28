import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { BusinessCaseComponent } from './components/customer-form/business-case/business-case.component';
import { NationalAddressComponent } from './components/customer-form/national-address/national-address.component';
import { PersonalDataComponent } from './components/customer-form/personal-data/personal-data.component';
import { WorkDataComponent } from './components/customer-form/work-data/work-data.component';
import { CoreModule } from 'src/app/core/core.module';
import { CustomersTableComponent } from './components/customers-table/customers-table.component';
import { HeaderIconComponent } from './components/customers-table/ag-grid/custom-cells/header-icon.component';
import { CustomersMoreActionsCell } from './components/customers-table/ag-grid/custom-cells/customers-more-actions.cell';
import { SideDataComponent } from './components/side-data/side-data.component';
import { BusinessCaseActionCell } from './components/customer-form/business-case/ag-grid/custom-cells/business-case-action.cell';
import { DialogIdentityComponent } from './components/toaster/dialog-identity/dialog-identity.component';
import { CustomersStatusCell } from './components/customers-table/ag-grid/custom-cells/customer-status.cell';
import { CustomersAddressCell } from './components/customers-table/ag-grid/custom-cells/address.cell';
@NgModule({
  declarations: [
    CustomerFormComponent,
    PersonalDataComponent,
    BusinessCaseComponent,
    NationalAddressComponent,
    WorkDataComponent,
    CustomersTableComponent,
    HeaderIconComponent,
    CustomersMoreActionsCell,
    SideDataComponent,
    BusinessCaseActionCell,
    DialogIdentityComponent,
    CustomersStatusCell,
    CustomersAddressCell,
  ],
  imports: [CommonModule, CustomersRoutingModule, CoreModule],
  providers: [DatePipe],
})
export class CustomersModule {}
