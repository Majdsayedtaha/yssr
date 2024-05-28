import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    data: {
      breadcrumb: { skip: true },
    },
    loadChildren: () => import('./modules/layout/layout.module').then(m => m.LayoutModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./core/components/not-found-page/not-found-page.module').then(m => m.NotFoundPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
