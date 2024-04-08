export interface LastPass {
  user_id: number;
  quizzes: [
    {
      quiz_id: number;
      last_quiz_pass_at: string;
    }
  ];
}