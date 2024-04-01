import { UserInfo } from './UserInfo';

export interface UserInvited extends UserInfo {
  action_id: number;
  action: string;
}