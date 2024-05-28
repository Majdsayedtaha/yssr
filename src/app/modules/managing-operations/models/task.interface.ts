export interface ITask {
  startDate: string;
  endDate: string;
  priorityId: string;
  priority: string;
  userId: string;
  user: string;
  statusId: string;
  status: string;
  projectId: string;
  project: string;
}
export interface ITaskStatistics extends ITask {
  taskEnded: string;
  taskCancel: string;
  taskDaley: string;
}
