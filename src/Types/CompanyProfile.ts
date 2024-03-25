import { UserInfo } from './UserInfo';

export interface CompanyProfile {
  company_id: number;
  company_name: string;
  company_title: string;
  company_avatar: string;
  is_visible: boolean;
  company_description: string;
  company_city: string;
  company_phone: string;
  company_links: string[];
  company_owner: UserInfo;
}