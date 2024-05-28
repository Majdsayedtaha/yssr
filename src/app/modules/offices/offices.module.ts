import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { OfficesRoutingModule } from './offices-routing.module';
import { ExternalOfficeFormComponent } from './components/external-office-form/external-office-form.component';
import { UsersExternalOfficesComponent } from './components/users-external-offices/users-external-offices.component';
import { OfficeAgreementsPricesComponent } from './components/office-agreements-prices/office-agreements-prices.component';
import { CoreModule } from 'src/app/core/core.module';
import { OfficesMoreActionsCell } from './components/external-office-table/agGrid/custom-cell/office-more-action.cell';
import { ExternalOfficeTableComponent } from './components/external-office-table/external-office-table.component';
import { SideDetailsOfficeComponent } from './components/side-details-office/side-details-office.component';
import { SideAddPriceComponent } from './components/side-add-price/side-add-price.component';
import { AgreementPriceActionCell } from './components/office-agreements-prices/agGrid/custom-cell/agreement-price-action.cell';
import { DialogAgreementPriceComponent } from './components/office-agreements-prices/dialog-agreement-price/dialog-agreement-price.component';

@NgModule({
  declarations: [
    ExternalOfficeTableComponent,
    ExternalOfficeFormComponent,
    UsersExternalOfficesComponent,
    OfficeAgreementsPricesComponent,
    OfficesMoreActionsCell,
    SideDetailsOfficeComponent,
    SideAddPriceComponent,
    AgreementPriceActionCell,
    DialogAgreementPriceComponent,
  ],
  imports: [CommonModule, OfficesRoutingModule, CoreModule],
  providers: [DatePipe],
})
export class OfficesModule {}
