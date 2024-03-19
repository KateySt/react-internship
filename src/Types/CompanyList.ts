import { Company } from './Company';


export interface CompanyList {
  companies: Company[],
  pagination: {
    current_page: number,
    total_page: number,
    total_results: number
  }
}