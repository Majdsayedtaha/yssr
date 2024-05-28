import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { RecruitmentChartsComponent } from './components/recruitment-charts/recruitment-charts.component';
import { RefundChartsComponent } from './components/refund-charts/refund-charts.component';
import { CustomersChartsComponent } from './components/customers-charts/customers-charts.component';
import { WorkerChartsComponent } from './components/worker-charts/worker-charts.component';
import { RentChartsComponent } from './components/rent-charts/rent-charts.component';
import { WaiverChartsComponent } from './components/waiver-charts/waiver-charts.component';
import { CoreModule } from 'src/app/core/core.module';
import { SuretyTransferChartsComponent } from './components/surety-transfer-charts/surety-transfer-charts.component';
import { FormsModule } from '@angular/forms';
import { ComplaintsChartsComponent } from './components/complaints-charts/complaints-charts.component';

@NgModule({
  declarations: [
    MainComponent,
    RecruitmentChartsComponent,
    RefundChartsComponent,
    CustomersChartsComponent,
    WorkerChartsComponent,
    RentChartsComponent,
    WaiverChartsComponent,
    SuretyTransferChartsComponent,
    ComplaintsChartsComponent,
  ],
  imports: [CommonModule, CoreModule, MainRoutingModule, FormsModule],
  providers: [DatePipe],
})
export class MainModule {}
