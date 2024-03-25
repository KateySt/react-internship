import { Company } from './Company';
import { Pagination } from './Pagination';


export interface CompanyList {
  companies: Company[],
  pagination: Pagination;
}