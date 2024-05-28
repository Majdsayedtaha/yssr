import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectAction } from '../actions/project.action';
import { IProjectStatistics } from '../models/project.interface';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ProjectService {
  private _ProjectAction: ProjectAction;
  updateStatistics = new BehaviorSubject<IProjectStatistics | null>(null);

  constructor(private _http: HttpClient) {
    this._ProjectAction = new ProjectAction(_http);
  }

  addProject(newProject: any) {
    return this._ProjectAction.add(newProject);
  }

  updateProject(projectId: string, updatedProject: any) {
    return this._ProjectAction.put(projectId, updatedProject);
  }

  getProjectList(formParams: any) {
    return this._ProjectAction.get(formParams);
  }

  getProjectDetails(projectId: string) {
    return this._ProjectAction.getInfo(projectId);
  }

  deleteProject(projectId: string) {
    return this._ProjectAction.delete(projectId);
  }
}
