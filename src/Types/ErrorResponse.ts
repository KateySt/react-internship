import { AxiosRequestConfig } from 'axios';

export interface ErrorResponse {
  data: any;
  status: number;
  config?: AxiosRequestConfig;
}