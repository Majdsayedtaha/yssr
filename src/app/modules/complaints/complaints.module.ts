import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ComplaintsRoutingModule } from './complaints-routing.module';
import { ComplaintsComponent } from './components/complaints/complaints.component';
import { CoreModule } from 'src/app/core/core.module';
import { DialogComplaintsComponent } from './dialog/dialog-complaints/dialog-complaints.component';
import { ComplaintsMoreActionsCell } from './more-action/complaints-more-action.cell';

@NgModule({
  declarations: [ComplaintsComponent, DialogComplaintsComponent, ComplaintsMoreActionsCell],
  imports: [CommonModule, ComplaintsRoutingModule, CoreModule],
  providers: [DatePipe],
})
export class ComplaintsModule {}
