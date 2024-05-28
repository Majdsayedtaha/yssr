export interface IProject {
  startDate: string;
  endDate: string;
  nameEn:string
  nameAr:string
}
export interface IProjectStatistics extends IProject{
  projectEnded: string;
  projectCancel: string;
  projectDaley: string;

}
