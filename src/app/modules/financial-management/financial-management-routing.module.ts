import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sales',
    data: {
      breadcrumb: 'label.financial.sales',
    },
    loadChildren: () => import('./modules/sales/sales.module').then(m => m.SalesModule),
  },
  {
    path: 'sales-rebound',
    data: {
      breadcrumb: 'label.financial.sales_rebound',
    },
    loadChildren: () => import('./modules/sales-rebound/sales-rebound.module').then(m => m.SalesReboundModule),
  },
  {
    path: 'receipt',
    data: {
      breadcrumb: 'label.financial.receipt',
    },
    loadChildren: () => import('./modules/receipt/receipt.module').then(m => m.ReceiptModule),
  },
  {
    path: 'bills-exchange',
    data: {
      breadcrumb: 'label.financial.bills_exchange',
    },
    loadChildren: () => import('./modules/bills-exchange/bills-exchange.module').then(m => m.BillsExchangeModule),
  },
  {
    path: 'purchases',
    data: {
      breadcrumb: 'label.financial.purchases',
    },
    loadChildren: () => import('./modules/purchases/purchases.module').then(m => m.PurchasesModule),
  },
  {
    path: 'purchases-rebound',
    data: {
      breadcrumb: 'label.financial.purchases_rebound',
    },
    loadChildren: () =>
      import('./modules/purchases-rebound/purchases-rebound.module').then(m => m.PurchasesReboundModule),
  },
  {
    path: 'financial-movements',
    data: {
      breadcrumb: 'label.financial.financial_movements',
    },
    loadChildren: () =>
      import('./modules/financial-movements/financial-movements.module').then(m => m.FinancialMovementsModule),
  },
  {
    path: 'settings',
    data: {
      breadcrumb: 'label.financial.settings',
    },
    loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sales',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialManagementRoutingModule {}
