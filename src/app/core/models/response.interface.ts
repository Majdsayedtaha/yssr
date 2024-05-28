/**
 * Response Format
 * */
export interface IResponse<T> {
  data: T;
  message: string;
}

/**
 * Response Pagination
 * */
export interface IPagination<A, B> {
  pagination: IPaginationOptions;
  statistics: B;
  list: A[];
}

export interface IPaginationOptions {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
