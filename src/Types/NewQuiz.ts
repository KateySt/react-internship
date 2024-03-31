import { Question } from './Question';

export interface NewQuiz {
  quiz_name: string;
  quiz_frequency: number;
  company_id: number;
  quiz_description: string;
  questions_list: Question[];
}