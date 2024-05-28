import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { UserMoreActionsCell } from './components/users-table/agGrid/custom-cell/user-more-action.cell';
import { AccountAddComponent } from './components/account-add/account-add.component';
import { CoreModule } from 'src/app/core/core.module';
import { SideAccountInfoComponent } from './components/users-table/side-account-info/side-account-info.component';
@NgModule({
  declarations: [UsersTableComponent, UserMoreActionsCell, AccountAddComponent, SideAccountInfoComponent],
  imports: [CommonModule, UsersRoutingModule, CoreModule],
  providers: [DatePipe],
})
export class UsersModule {}
