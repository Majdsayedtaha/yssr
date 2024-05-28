//Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { CoreModule } from 'src/app/core/core.module';

//Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ChangeUserPasswordComponent } from './components/navbar/change-user-password/change-user-password.component';

@NgModule({
  declarations: [LayoutComponent, SidenavComponent, NavbarComponent, ChangeUserPasswordComponent],
  imports: [CoreModule, CommonModule, FormsModule, LayoutRoutingModule, NgxSkeletonLoaderModule],
})
export class LayoutModule {}
