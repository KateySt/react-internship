export interface Response<T> {
  status_code: number;
  detail: string;
  result: T;
}