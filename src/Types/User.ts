export interface User {
  user_id?: number;
  user_password: string;
  user_password_repeat: string;
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_avatar?: string;
}