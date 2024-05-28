import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CoreModule } from 'src/app/core/core.module';
import { LayoutModule } from '../layout/layout.module';
import { WaiverRoutingModule } from './waiver-routing.module';
import { SideInfoWaiverComponent } from './components/side-info/side-info.component';
import { WaiverRequestsTableComponent } from './components/requests-table/requests-table.component';
import { WaiverMoreActionsCell } from './components/requests-table/ag-grid/cellRenderers/actions.cell';
import { WaiverRequestStatusCell } from './components/requests-table/ag-grid/cellRenderers/request-status.cell';
import { WaiverFormRequestWaiverComponent } from './components/request-form-waiver/request-form-waiver.component';
import { WaiverFormRequestWorkerComponent } from './components/request-form-worker/request-form-worker.component';
import { AddProcedureComponent } from './components/add-procedure/add-procedure.component';
import { TypeOrderCell } from './components/requests-table/ag-grid/cellRenderers/type-order.cell';
import { SideInfoWaiverExternalComponent } from './components/side-info-external/side-info-external.component';
import { SideLinkResumeWaiverComponent } from './components/side-link-resume-waiver/side-link-resume-waiver.component';
import { LinkedToResumeWaiverCell } from './components/requests-table/ag-grid/cellRenderers/link-resume.cell';

@NgModule({
  declarations: [
    TypeOrderCell,
    WaiverMoreActionsCell,
    LinkedToResumeWaiverCell,
    AddProcedureComponent,
    WaiverRequestStatusCell,
    SideInfoWaiverComponent,
    WaiverRequestsTableComponent,
    SideInfoWaiverExternalComponent,
    WaiverFormRequestWaiverComponent,
    WaiverFormRequestWorkerComponent,
    SideLinkResumeWaiverComponent,
  ],
  imports: [CommonModule, WaiverRoutingModule, CoreModule, LayoutModule],
  providers: [DatePipe],
})
export class WaiverModule {}
