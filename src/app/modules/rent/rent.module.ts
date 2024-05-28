import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { LayoutModule } from '@angular/cdk/layout';
import { CoreModule } from 'src/app/core/core.module';
import { RentRoutingModule } from './rent-routing.module';
import { RequestStatusCell } from './components/grid/request-status.cell';
import { RentFormComponent } from './components/rent-form/rent-form.component';
import { RentTableComponent } from './components/rent-table/rent-table.component';
import { RentGridComponent } from './components/grid/rent-grid/rent-grid.component';
import { SideInfoRentComponent } from './components/side-info-rent/side-info-rent.component';
import { SideAddProcedureComponent } from './components/side-add-procedure/side-add-procedure.component';
import { RentProcedureFormComponent } from './components/rent-procedure-form/rent-procedure-form.component';
import { SideRentFinancialComponent } from './components/side-rent-financial/side-rent-financial.component';
import { SideRentProceduresComponent } from './components/side-rent-procedures/side-rent-procedures.component';
import { RentMoreActionsCellComponent } from './components/grid/rent-more-actions-cell/rent-more-actions-cell.component';
import { ContractAvailableCell } from './components/grid/contract-available-cell.component';
import { WorkerRentTableComponent } from './components/worker-rent-table/worker-rent-table.component';
@NgModule({
  declarations: [
    RentGridComponent,
    RentFormComponent,
    RequestStatusCell,
    RentTableComponent,
    SideInfoRentComponent,
    SideAddProcedureComponent,
    RentProcedureFormComponent,
    SideRentFinancialComponent,
    SideRentProceduresComponent,
    RentMoreActionsCellComponent,
    WorkerRentTableComponent,
    ContractAvailableCell,
  ],
  imports: [CommonModule, RentRoutingModule, CoreModule, LayoutModule],
  providers: [DatePipe],
})
export class RentModule {}
