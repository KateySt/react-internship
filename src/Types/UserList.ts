import { User } from './User';

export interface UserList {
  users: User[],
  pagination: {
    current_page: number,
    total_page: number,
    total_results: number
  }
}