import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { User } from 'Types/User';

axios.defaults.baseURL = process.env.REACT_APP_HOST_BACK as string;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error: AxiosError<ErrorResponse>) => {
    const { data, status, config } = error.response!;
    switch (status) {
      case 400:
        console.error('Bad request:', data);
        break;
      case 401:
        console.error('Unauthorized');
        break;
      case 404:
        console.error('Not found:', config?.url);
        break;
      case 500:
        console.error('Server error:', data);
        break;
      default:
        console.error('Unknown error occurred');
        break;
    }
    return Promise.reject(error);
  },
);

interface ErrorResponse {
  data: any;
  status: number;
  config?: AxiosRequestConfig;
}

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const request = {
  get: <T>(url: string, config?: AxiosRequestConfig) => axios.get<T>(url, config).then(responseBody),
  post: <T>(url: string, body: any, config?: AxiosRequestConfig) =>
    axios.post<T>(url, body, config).then(responseBody),
  delete: <T>(url: string, config?: AxiosRequestConfig) => axios.delete<T>(url, config).then(responseBody),
  put: <T>(url: string, body: any, config?: AxiosRequestConfig) => axios.put<T>(url, body, config).then(responseBody),
};

const test = {
  details: () => request.get('/'),
};

const companies = {
  list: () => request.get('/companies'),
};

const users = {
  list: () => request.get<User[]>('/users'),
  details: (id: string) => request.get<User>(`/user/${id}`),
  create: (data: User) => request.post<User>('/user', data),
};

const api = {
  test,
  companies,
  users,
};

export default api;