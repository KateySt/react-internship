export interface User {
  user_id?: number;
  user_password: string;
  user_password_repeat: string;
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_avatar?: string;
  user_city?: string;
  user_phone?: string;
  user_links?: string[];
  is_superuser?: boolean;
  user_status?: string;
}