import { UserInfo } from './UserInfo';

export interface UserList {
  users: UserInfo[],
  pagination: {
    current_page: number,
    total_page: number,
    total_results: number
  }
}