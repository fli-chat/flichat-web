export interface ApiResponse<T> {
  code: number;
  result: boolean;
  msg: string;
  data: T;
}

export interface NestedDataResponse<T> {
  data: T;
}

export interface ErrorResponse {
  message?: string;
}

export interface Pageable {
  pageNo: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
}
