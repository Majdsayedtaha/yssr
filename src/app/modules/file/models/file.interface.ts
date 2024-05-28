
export interface IFileAcceptance {
  DateValue: string;
  ObjectiveTitle: string;
  SubjectValue: string;
  SenderName: string;
  WriterName: string;
  WriterRole: string;
  MinimumYearExperience: string;
  MinimumSalary: string;
  CompanyName: string;
}

export enum FileTypeEnum {
  ACCEPTANCE_OF_NEW_RULES_FOR_HSW = 0,
  CONTINGENCY_PLAN = 1,
  INFO_SHEET = 2,
  MEDICAL_WAIVER = 3,
  RUNAWAY_LETTER = 4,
  POEA_FORMAT_AFFIDAVIT_OF_UNDERTAKING = 5,
}
