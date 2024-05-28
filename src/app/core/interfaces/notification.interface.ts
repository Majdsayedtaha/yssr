import { IEnum } from './enum.interface';

export interface INotification {
  description: string;
  id: string;
  objectId: string;
  title: string;
  date: string;
  read: boolean;
  type: IEnum;
}
