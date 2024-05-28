import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FileRoutingModule } from './file-routing.module';
import { FileAcceptanceComponent } from './components/file-acceptance/file-acceptance.component';
import { CoreModule } from 'src/app/core/core.module';
import { LayoutModule } from '@angular/cdk/layout';
import { FileContingencyComponent } from './components/file-contingency/file-contingency.component';
import { FileInfoSheetComponent } from './components/file-info/file-info.component';
import { FileMedicalComponent } from './components/file-medical/file-medical.component';
import { FileRunawayComponent } from './components/file-runaway/file-runaway.component';
import { FileAffidavitComponent } from './components/file-affidavit/file-affidavit.component';

@NgModule({
  declarations: [
    FileMedicalComponent,
    FileRunawayComponent,
    FileInfoSheetComponent,
    FileAffidavitComponent,
    FileAcceptanceComponent,
    FileContingencyComponent,
  ],
  imports: [CoreModule, CommonModule, LayoutModule, FileRoutingModule],
  providers: [DatePipe],
})
export class FileModule {}
