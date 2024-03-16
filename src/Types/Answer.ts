export interface Answer<T> {
  status_code: number;
  detail: string;
  result: T;
}