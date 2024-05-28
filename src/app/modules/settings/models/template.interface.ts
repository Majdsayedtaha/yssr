import { IEnum } from "src/app/core/interfaces";

export interface ITemplate {
  code: number;
  id: string;
  name: string;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
  categoryId: string;
  category: IEnum;
}
