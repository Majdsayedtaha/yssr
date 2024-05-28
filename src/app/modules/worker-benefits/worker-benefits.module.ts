import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CoreModule } from 'src/app/core/core.module';
import { SideInfoBenefitsComponent } from './components/side-info/side-info.component';
import { LayoutModule } from '../layout/layout.module';
import { BenefitsTableComponent } from './components/benefits-table/benefits-table.component';
import { BenefitsMoreActionsCell } from './components/benefits-table/ag-grid/cellRenderers/actions.cell';
import { BenefitFormRequestComponent } from './components/benefit-form/benefit-form.component';
import { WorkerBenefitsRoutingModule } from './worker-benefits-routing.module';

@NgModule({
  declarations: [
    BenefitsTableComponent,
    SideInfoBenefitsComponent,
    BenefitsMoreActionsCell,
    BenefitFormRequestComponent,
  ],
  imports: [CommonModule, WorkerBenefitsRoutingModule, CoreModule, LayoutModule],
  providers: [DatePipe],
})
export class WorkerBenefitsModule {}
