import { Question } from './Question';

export interface NewQuiz {
  quiz_name: string;
  quiz_frequency: number;
  company_id: number;
  questions_list: Question[];
}