import { Company } from './Company';

export interface CompanyInvited extends Company {
  action_id: number;
  action: string;
}