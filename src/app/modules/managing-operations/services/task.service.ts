import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskAction } from '../actions/task.action';
import { ITaskStatistics } from '../models/task.interface';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class TaskService {
  private _taskAction: TaskAction;
  updateStatistics = new BehaviorSubject<ITaskStatistics | null>(null);

  constructor(private _http: HttpClient) {
    this._taskAction = new TaskAction(_http);
  }

  addTask(newTask: any) {
    return this._taskAction.add(newTask);
  }

  updateTask(taskId: string, updatedTask: any) {
    return this._taskAction.put(taskId, updatedTask);
  }

  updateTaskStatus(taskId: string, statusId: string) {
    return this._taskAction.updateTaskStatus(taskId, statusId);
  }

  getTaskList(formParams: any) {
    return this._taskAction.get(formParams);
  }

  getMyTask(formParams: any) {
    return this._taskAction.getMyTask(formParams);
  }

  getTaskDetails(taskId: string) {
    return this._taskAction.getInfo(taskId);
  }

  deleteTask(taskId: string) {
    return this._taskAction.delete(taskId);
  }
}
