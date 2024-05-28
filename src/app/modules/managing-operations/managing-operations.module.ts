import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ManagingOperationsRoutingModule } from './managing-operations-routing.module';
import { TasksTableComponent } from './components/tasks-table/tasks-table.component';
import { MyTasksComponent } from './components/my-tasks/my-tasks.component';
import { CoreModule } from 'src/app/core/core.module';
import { managingOperationsMoreActionsCell } from './components/tasks-table/ag-grid/custom-cell/task.cell';
import { DialogAddTaskComponent } from './components/dialog-add-task/dialog-add-task.component';
import { ProjectComponent } from './components/project/project.component';
import { DialogAddProjectComponentComponent } from './components/dialog-add-project-component/dialog-add-project-component.component';
import { ProjectCell } from './components/project/cell/project.cell';

@NgModule({
  declarations: [
    TasksTableComponent,
    MyTasksComponent,
    managingOperationsMoreActionsCell,
    DialogAddTaskComponent,
    ProjectComponent,
    DialogAddProjectComponentComponent,
    ProjectCell,
  ],
  imports: [CommonModule, ManagingOperationsRoutingModule, CoreModule],
  providers: [DatePipe],
})
export class ManagingOperationsModule {}
