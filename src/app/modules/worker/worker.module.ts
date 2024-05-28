import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { WorkerRoutingModule } from './worker-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { WorkerTableComponent } from './components/worker-table/worker-table.component';
import { WorkerFormComponent } from './components/worker-form/worker-form.component';
import { StatisticsWorkerComponent } from './components/statistics-worker/statistics-worker.component';
import { CheckboxFilterAgGridComponent } from './components/filters/checkbox-filter';
import { TextFilterComponent } from './components/filters/text-filter.component';
import { WorkersMoreActionsCell } from './components/filters/workers-more-actions.cell';
import { PersonalStepComponent } from './components/worker-form/personal-step/personal-step.component';
import { PassportStepComponent } from './components/worker-form/passport-step/passport-step.component';
import { ExperienceStepComponent } from './components/worker-form/experience-step/experience-step.component';
import { ExtraDetailsStepComponent } from './components/worker-form/extra-details-step/extra-details-step.component';
import { WorkerStatusCell } from './components/filters/worker-status.cell';
import { SideInfoWorkerComponent } from './components/side-info-worker/side-info-worker.component';
import { LayoutModule } from '../layout/layout.module';
import { WorkerAvailableCell } from './components/filters/worker-available-cell.component';

@NgModule({
  declarations: [
    WorkerTableComponent,
    WorkerFormComponent,
    StatisticsWorkerComponent,
    CheckboxFilterAgGridComponent,
    TextFilterComponent,
    WorkersMoreActionsCell,
    WorkerStatusCell,
    PersonalStepComponent,
    PassportStepComponent,
    ExperienceStepComponent,
    ExtraDetailsStepComponent,
    SideInfoWorkerComponent,
    WorkerAvailableCell,
  ],
  imports: [CommonModule, WorkerRoutingModule, CoreModule, LayoutModule],
  providers: [DatePipe],
})
export class WorkerModule {}
