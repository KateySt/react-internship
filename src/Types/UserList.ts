import { UserInfo } from './UserInfo';
import { Pagination } from './Pagination';

export interface UserList {
  users: UserInfo[],
  pagination: Pagination;
}