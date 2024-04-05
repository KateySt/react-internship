import { UserInfo } from './UserInfo';
import { Question } from './Question';

export interface Quiz extends UserInfo {
  quiz_id: number;
  quiz_name: string;
  quiz_title: string;
  quiz_description: string;
  quiz_frequency: number;
  created_by: UserInfo;
  questions_list: Question[];
}