import { IEnum } from "src/app/core/interfaces";

export interface IApartment {
  id?: string | undefined;
  unitNumber: string;
  roomsCount: number;
  workerCapacity: number;
  supervisorsIds: string[] | IEnum[];
  supervisors?: IEnum[];
}
