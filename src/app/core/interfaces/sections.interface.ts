export interface Sections {
  name?: string;
  svg?: string;
  route?: string;
  parent?: boolean;
  queryParams?: any;
  value?: number;
  roleAuth?: string | string[];
  roleShownAlways?: boolean;
  children?: Sections[];
  isAdmin?: boolean;
}
