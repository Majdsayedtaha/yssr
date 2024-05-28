import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { RecruitmentContractsRoutingModule } from './recruitment-contracts-routing.module';
import { RecruitmentOrdersComponent } from './components/warranty-table/warranty-table.component';
import { ContractsMoreActionsCell } from './components/contracts-table/ag-grid/custom-cells/contract-more-actions.cell';
import { ContractsTableComponent } from './components/contracts-table/contracts-table.component';
import { SideContractProceduresComponent } from './components/side-contract-procedures/side-contract-procedures.component';
import { SideContractDetailsComponent } from './components/side-contract-details/side-contract-details.component';
import { RecruitmentContractFormComponent } from './components/recruitment-contract-form/recruitment-contract-form.component';
import { IdentifyCustomerComponent } from './components/recruitment-contract-form/identify-customer/identify-customer.component';
import { CreateContractComponent } from './components/recruitment-contract-form/create-contract/create-contract.component';
import { ExternalOfficesDataComponent } from './components/recruitment-contract-form/external-offices-data/external-offices-data.component';
import { FinancialStatementsComponent } from './components/recruitment-contract-form/financial-statements/financial-statements.component';
import { CustomerIdentifiedMoreActionsCell } from './components/recruitment-contract-form/identify-customer/ag-grid/custom-cells/customer-identified-more-actions.cell';
import { CustomerIdentifiedStatusCell } from './components/recruitment-contract-form/identify-customer/ag-grid/custom-cells/customer-identified-status.cell';
import { SideAddProcedureComponent } from './components/side-add-procedure/side-add-procedure.component';
import { AddProcedureComponent } from './components/add-procedure/add-procedure.component';
import { CommissionActionCell } from './components/recruitment-contract-form/financial-statements/ag-grid/custom-cell/commission-action.cell';
import { SideLinkResumeComponent } from './components/side-link-resume/side-link-resume.component';
import { LinkedToResumeContractsCell } from './components/contracts-table/ag-grid/custom-cells/linked-to-resume-contracts.cell';
import { WarrantyMoreActionsCell } from './components/warranty-table/ag-grid/warranty-more-actions.cell';
import { DialogExtensionContractComponent } from './components/warranty-table/toaster/dialog-extension/dialog-extension-contract.component';
import { WarrantyStateContractsCell } from './components/warranty-table/ag-grid/warranty-state.cell';

@NgModule({
  declarations: [
    CommissionActionCell,
    AddProcedureComponent,
    ContractsTableComponent,
    CreateContractComponent,
    WarrantyMoreActionsCell,
    SideLinkResumeComponent,
    ContractsMoreActionsCell,
    IdentifyCustomerComponent,
    SideAddProcedureComponent,
    RecruitmentOrdersComponent,
    WarrantyStateContractsCell,
    LinkedToResumeContractsCell,
    SideContractDetailsComponent,
    ExternalOfficesDataComponent,
    FinancialStatementsComponent,
    CustomerIdentifiedStatusCell,
    SideContractProceduresComponent,
    DialogExtensionContractComponent,
    RecruitmentContractFormComponent,
    CustomerIdentifiedMoreActionsCell,
  ],
  imports: [CommonModule, CoreModule, RecruitmentContractsRoutingModule],
  providers: [DatePipe],
})
export class RecruitmentContractsModule {}
