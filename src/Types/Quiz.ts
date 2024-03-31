import { UserInfo } from './UserInfo';

export interface Quiz extends UserInfo {
  quiz_id: number;
  quiz_name: string;
  quiz_title: string;
  quiz_description: string;
  quiz_frequency: number;
  created_by: UserInfo;
  questions_list: {
    question_id: number;
    question_text: string;
    question_answers: string[];
    question_correct_answer: number;
  }[];
}