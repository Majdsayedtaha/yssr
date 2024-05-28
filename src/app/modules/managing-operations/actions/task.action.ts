import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination, IResponse } from 'src/app/core/models';
import { CRUDService } from 'src/app/core/services/crud.service';
import { ITask, ITaskStatistics } from '../models/task.interface';

export class TaskAction extends CRUDService<ITask, ITaskStatistics> {
  constructor(http: HttpClient) {
    super(http, 'Task');
  }

  add(formData: ITask): Observable<IResponse<ITask>> {
    return this.createEntity('AddTask', formData, 'true');
  }
  put(id: string, formData: ITask): Observable<IResponse<ITask>> {
    return this.updateEntity('UpdateTask', id, formData, 'false');
  }
  updateTaskStatus(taskId: string, statusId: string): Observable<IResponse<ITask>> {
    return this.updateEntity(`UpdateTaskStatus/${taskId}/${statusId}`);
  }
  get(formData: { [key: string]: string }): Observable<IResponse<IPagination<ITask, ITaskStatistics>>> {
    return this.readPaginationEntities('GetTasksTable', formData);
  }
  getMyTask(formData: { [key: string]: string }): Observable<IResponse<IPagination<ITask, ITaskStatistics>>> {
    return this.readPaginationEntities('MyTasks', formData);
  }
  getInfo(id: string): Observable<IResponse<ITask>> {
    return this.readEntity('GetTaskInfo', id);
  }
  delete(id: string): Observable<IResponse<ITask>> {
    return this.deleteEntity('Delete', id);
  }
}
