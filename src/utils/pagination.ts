export interface IPaginationOptions {
  page: number;
  limit: number;
}

export interface IPaginationResult<T> {
  data: T[];
  count: number;
  totalPages: number;
  currentPage: number;
}
