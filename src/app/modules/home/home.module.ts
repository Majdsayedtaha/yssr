import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CoreModule } from 'src/app/core/core.module';
import { HomeGridComponent } from './components/ag-grid/home-grid.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomePageComponent, HomeGridComponent],
  imports: [CommonModule, HomeRoutingModule, CoreModule, FormsModule],
  providers: [DatePipe],
})
export class HomeModule {}
