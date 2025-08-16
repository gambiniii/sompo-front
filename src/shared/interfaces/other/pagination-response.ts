export interface PaginationResponse<T> {
  data: T[];
  perPage: number;
  totalPages: number;
  totalRows: number;
}
