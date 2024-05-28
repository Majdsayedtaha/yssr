import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundPageRoutingModule } from './not-found-page-routing.module';
import { NotFoundPageComponent } from './not-found-page.component';
import { CoreModule } from '../../core.module';

@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [CommonModule, NotFoundPageRoutingModule, CoreModule],
})
export class NotFoundPageModule {}
