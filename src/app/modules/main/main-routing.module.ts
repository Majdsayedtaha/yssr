import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { AppRoutes } from 'src/app/core/constants';
const routes: Routes = [
  {
    path: '',
    title: AppRoutes.baseAppTitle + 'DashBoard Page',
    component: MainComponent,
    data: {
      breadcrumb: { skip: true },
    },

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
