import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes, IRoleEnum, IRolePermissionsEnum } from 'src/app/core/constants';
import { TasksTableComponent } from './components/tasks-table/tasks-table.component';
import { MyTasksComponent } from './components/my-tasks/my-tasks.component';
import { ProjectComponent } from './components/project/project.component';

const routes: Routes = [
  {
    path: 'project-table',
    title: AppRoutes.baseAppTitle + 'Project Table',
    component: ProjectComponent,
    data: {
      breadcrumb: 'label.managing_operations.project_table',
      roleAccessor: IRoleEnum.Setting,
      roleActions: [IRolePermissionsEnum.canView],
    },
  },
  {
    path: 'tasks-table',
    title: AppRoutes.baseAppTitle + 'Tasks Table',
    component: TasksTableComponent,
    data: {
      breadcrumb: 'label.managing_operations.tasks_table',
      roleAccessor: IRoleEnum.Setting,
      roleActions: [IRolePermissionsEnum.canView],
    },
  },
  {
    path: 'my-tasks',
    title: AppRoutes.baseAppTitle + 'My Tasks',
    component: MyTasksComponent,
    data: {
      breadcrumb: 'label.managing_operations.my_tasks',
      roleAccessor: IRoleEnum.Setting,
      roleActions: [IRolePermissionsEnum.canView],
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'project-table',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagingOperationsRoutingModule {}
