import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { User } from 'Types/User';
import { ErrorResponse } from 'Types/ErrorResponse';

const instance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_HOST_BACK as string,
  timeout: 5000,
  headers: { Accept: 'application/json' },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response) {
      const { data, status, config } = error.response;
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
    } else if (error.request) {
      console.error('Request made but no response received');
    } else {
      console.error('Error in making request:', error.message);
    }
    return Promise.reject(error);
  },
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const request = {
  get: <T>(url: string, config?: AxiosRequestConfig) => instance.get<T>(url, config).then(responseBody),
  post: <T>(url: string, body: any, config?: AxiosRequestConfig) =>
    instance.post<T>(url, body, config).then(responseBody),
  delete: <T>(url: string, config?: AxiosRequestConfig) => instance.delete<T>(url, config).then(responseBody),
  put: <T>(url: string, body: any, config?: AxiosRequestConfig) => instance.put<T>(url, body, config).then(responseBody),
};

const test = {
  details: () => request.get('/'),
};

const companies = {
  list: () => request.get('/companies'),
};

const users = {
  getMe: () => request.get<User>('/auth/me/'),
  list: (queryParams?: {}) => request.get<User[]>('/users', { params: queryParams }),
  login: (body: {}) => request.post('/auth/login/', body),
  details: (id: number) => request.get<User>(`/user/${id}`),
  create: (data: User) => request.post<User>('/user', data),
  updateAvatar: (data: any, id: number) => request.put<any>(`/user/${id}/update_avatar/`, data),//TODO Type
};

const api = {
  test,
  companies,
  users,
};

export default api;