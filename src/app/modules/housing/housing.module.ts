import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { HousingRoutingModule } from './housing-routing.module';
import { HousingTableComponent } from './components/housing-table/housing-table.component';
import { HousingMoreActionsCellComponent } from './components/grid/housing-more-actions-cell/housing-more-actions-cell.component';
import { HousingGridComponent } from './components/grid/housing-grid/housing-grid.component';
import { CoreModule } from 'src/app/core/core.module';
import { LayoutModule } from '@angular/cdk/layout';
import { DialogHousingWorkerFormComponent } from './components/toaster/dialog-housing-worker-form/dialog-housing-worker-form.component';
import { SideHousingInfoComponent } from './components/side-housing-info/side-housing-info.component';
import { HousingFormComponent } from './components/housing-form/housing-form.component';
import { WorkerHousingFormComponent } from './components/worker-housing-form/worker-housing-form.component';
import { HouseWorkerActionsCellComponent } from './components/grid/house-worker-more-actions-cell/house-worker-more-actions-cell.component';

@NgModule({
  declarations: [
    HousingTableComponent,
    HousingMoreActionsCellComponent,
    DialogHousingWorkerFormComponent,
    HousingGridComponent,
    SideHousingInfoComponent,
    HousingFormComponent,
    WorkerHousingFormComponent,
    HouseWorkerActionsCellComponent,
  ],
  imports: [CommonModule, HousingRoutingModule, CoreModule, LayoutModule],
  providers: [DatePipe],
})
export class HousingModule {}
