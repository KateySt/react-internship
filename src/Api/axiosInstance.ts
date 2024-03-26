import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ErrorResponse } from 'Types/ErrorResponse';
import { User } from 'Types/User';
import { UserList } from 'Types/UserList';
import { NewUser } from 'Types/NewUser';
import { Response } from 'Types/Response';
import { UpdateUserInfo } from '../Types/UpdateUserInfo';
import { CompanyList } from '../Types/CompanyList';
import { CompanyProfile } from '../Types/CompanyProfile';
import { UpdateCompany } from '../Types/UpdateCompany';
import { UserInvited } from '../Types/UserInvited';
import { CompanyInvited } from '../Types/CompanyInvited';

const instance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_HOST_BACK as string,
  timeout: 10000,
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
  deleteCompany: (id: number) => request.delete<Response<string>>(`/company/${id}`),
  list: (queryParams?: {}) => request.get<Response<CompanyList>>('/companies', { params: queryParams }),
  details: (id: number) => request.get<Response<CompanyProfile>>(`/company/${id}`),
  create: (data: { company_name: string, is_visible: boolean }) => request.post<Response<{
    company_id: number
  }>>('/company', data),
  updateInfo: (data: UpdateCompany, id: number) =>
    request.put<Response<{ company_id: number }>>(`/company/${id}/update_info`, data),
  updateAvatar: (data: FormData, id: number) => request.put<Response<string>>(`/company/${id}/update_avatar`, data),
};

const users = {
  getMe: () => request.get<Response<User>>('/auth/me'),
  list: (queryParams?: {}) => request.get<Response<UserList>>('/users', { params: queryParams }),
  login: (body: {}) => request.post<Response<{ access_token: string, token_type: string }>>('/auth/login', body),
  details: (id: number) => request.get<Response<User>>(`/user/${id}`),
  create: (data: NewUser) => request.post<Response<{ user_id: number }>>('/user', data),
  updateAvatar: (data: FormData, id: number) => request.put<Response<string>>(`/user/${id}/update_avatar`, data),
  updateInfo: (data: UpdateUserInfo, id: number) =>
    request.put<Response<{ user_id: number }>>(`/user/${id}/update_info`, data),
  updatePassword: (data: { user_password: string, user_password_repeat: string }, id: number) =>
    request.put<Response<{ user_id: number }>>(`/user/${id}/update_password`, data),
  delete: (id: number) => request.delete<Response<string>>(`/user/${id}`),
  listCompanies: (id: number) => request.get<Response<{ companies: CompanyInvited[] }>>(`/user/${id}/companies_list`),
};

const actions = {
  declineAction: (id: number) => request.get<Response<null>>(`/action/${id}/decline_action`),
  createActionFromCompany: (companyId: number, userId: number) => request.get<Response<{
    action_id: number
  }>>(`/action/create_from_company/${companyId}/user/${userId}`),
  companyListInvites: (id: number) => request.get<Response<{ users: UserInvited[] }>>(`/company/${id}/invites_list`),
  userListInvites: (id: number) => request.get<Response<{ companies: CompanyInvited[] }>>(`/user/${id}/invites_list`),
};

const api = {
  test,
  companies,
  users,
  actions,
};

export default api;