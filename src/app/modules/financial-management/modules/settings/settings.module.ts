import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { BanksTableComponent } from './components/banks-table/banks-table.component';
import { StorageTableComponent } from './components/storage-table/storage-table.component';
import { CoreModule } from 'src/app/core/core.module';
import { StorageMoreActionsCell } from './components/storage-table/action-more/storage-more-action.cell';
import { DialogActionStorageComponent } from './components/storage-table/dialog-action/dialog-action-storage/dialog-action-storage.component';
import { DialogBankComponent } from './components/banks-table/dialog-bank/dialog-bank/dialog-bank.component';
import { BankMoreActionsCell } from './components/banks-table/more-action/bank-action-more.cell';
import { NetworkTableComponent } from './components/network-table/network-table.component';
import { DevicesTableComponent } from './components/devices-table/devices-table.component';
import { DialogDeviceComponent } from './components/devices-table/dialog-device/dialog-device.component';
import { DialogNetworkComponent } from './components/network-table/dialog-network/dialog-network.component';
import { DeviceMoreActionsCell } from './components/devices-table/more-action/device-more-action.cell';
import { NetworkMoreActionsCell } from './components/network-table/more-action/network-more-action.cell';
import { ExpenseTypeTableComponent } from './components/expense-type-table/expense-type-table.component';
import { DialogExpenseComponent } from './components/expense-type-table/dialog-expense/dialog-expense.component';
import { ExpenseGridComponent } from './components/expense-type-table/ag-grid/expense-type.grid.component';
import { expenseMoreActionsCell } from './components/expense-type-table/more-action/expense-type.cell';

@NgModule({
  declarations: [
    BanksTableComponent,
    StorageTableComponent,
    StorageMoreActionsCell,
    DialogActionStorageComponent,
    DialogBankComponent,
    BankMoreActionsCell,
    NetworkTableComponent,
    DevicesTableComponent,
    DialogDeviceComponent,
    DeviceMoreActionsCell,
    DialogNetworkComponent,
    NetworkMoreActionsCell,
    ExpenseTypeTableComponent,
    DialogExpenseComponent,
    ExpenseGridComponent,
    expenseMoreActionsCell,
  ],
  imports: [CommonModule, CoreModule, SettingsRoutingModule],
  providers: [DatePipe],
})
export class SettingsModule {}
