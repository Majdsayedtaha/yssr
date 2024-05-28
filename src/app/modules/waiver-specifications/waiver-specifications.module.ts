import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { WaiverRoutingModule } from './waiver-specifications-routing.module';
import { WaiverRequestsTableComponent } from './components/requests-table/requests-table.component';
import { CoreModule } from 'src/app/core/core.module';
import { WaiverRequestStatusCell } from './components/requests-table/ag-grid/cellRenderers/request-status.cell';
import { WaiverMoreActionsCell } from './components/requests-table/ag-grid/cellRenderers/actions.cell';
import { SideInfoWaiverComponent } from './components/side-info/side-info.component';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  declarations: [WaiverRequestsTableComponent, WaiverRequestStatusCell, WaiverMoreActionsCell, SideInfoWaiverComponent],
  imports: [CommonModule, WaiverRoutingModule, CoreModule, LayoutModule],
  providers: [DatePipe],
})
export class WaiverSpecificationsModule {}
