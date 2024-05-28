import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { WaiverRequestsTableComponent } from './components/requests-table/requests-table.component';
import { CoreModule } from 'src/app/core/core.module';
import { ElectFormRequestComponent } from './components/request-form/request-form.component';
import { ElectronicAuthRequestStatusCell } from './components/requests-table/ag-grid/cellRenderers/request-status.cell';
import { ElectronicAuthMoreActions } from './components/requests-table/ag-grid/cellRenderers/actions.cell';
import { SideInfoWaiverComponent } from './components/side-info/side-info.component';
import { LayoutModule } from '../layout/layout.module';
import { ElectronicAuthorizationRoutingModule } from './delegations-routing.module';

@NgModule({
  declarations: [
    WaiverRequestsTableComponent,
    ElectFormRequestComponent,
    ElectronicAuthRequestStatusCell,
    SideInfoWaiverComponent,
    ElectronicAuthMoreActions,
  ],
  imports: [CommonModule, ElectronicAuthorizationRoutingModule, CoreModule, LayoutModule],
  providers: [DatePipe],
})
export class ElectronicAuthorizationModule {}
