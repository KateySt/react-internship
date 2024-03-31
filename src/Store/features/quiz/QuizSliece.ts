import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import { NewQuiz } from 'Types/NewQuiz';
import api from 'Api/axiosInstance';
import { Quiz } from 'Types/Quiz';
import { Question } from 'Types/Question';


export interface QuizState {
  quiz: Quiz | null;
}

const initialState: QuizState = {
  quiz: null,
};
export const QuizSlice = createSlice({
  name: 'Quiz',
  initialState,
  reducers: {
    setQuizInfo: (state, action: PayloadAction<Quiz>) => {
      state.quiz = action.payload;
    },
    addQuestion: (state, action: PayloadAction<{
      question_id: number;
      question_text: string;
      question_answers: string[];
      question_correct_answer: number;
    }>) => {
      if (!state.quiz) return;
      state.quiz.questions_list = [...state.quiz.questions_list, action.payload];
    },
    deleteQuestion: (state, action: PayloadAction<number>) => {
      if (!state.quiz) return;
      state.quiz.questions_list = state.quiz.questions_list.filter((el) => el.question_id !== action.payload);
    },
    updateQuestion: (state, action: PayloadAction<{
      question_id: number;
      question_text: string;
      question_answers: string[];
      question_correct_answer: number;
    }>) => {
      if (!state.quiz) return;
      const index = state.quiz.questions_list.findIndex(question => question.question_id === action.payload.question_id);
      if (index !== -1) {
        state.quiz.questions_list[index] = {
          ...state.quiz.questions_list[index],
          question_text: action.payload.question_text,
          question_answers: action.payload.question_answers,
          question_correct_answer: action.payload.question_correct_answer,
        };
      }
    },
  },
});

export const { setQuizInfo, updateQuestion, deleteQuestion, addQuestion } = QuizSlice.actions;

export const selectQuiz = (state: RootState) => state.quiz.quiz;

export const createQuizAsync = (data: NewQuiz) => async () => {
  await api.quizzes.createQuiz(data)
    .then(el => {
      api.quizzes.updateQuiz(el.result.quiz_id, {
        quiz_name: data.quiz_name,
        quiz_title: '',
        quiz_description: data.quiz_description,
        quiz_frequency: data.quiz_frequency,
      });
    });
};

export const getQuizAsync = (id: number) => async (dispatch: AppDispatch) => {
  await api.quizzes.details(id) .then(el => {
    const quizInfo = el.result;
    const questionsWithDefaultAnswer = quizInfo.questions_list.map(question => ({
      ...question,
      question_correct_answer: 0,
    }));
    const updatedQuizInfo = { ...quizInfo, questions_list: questionsWithDefaultAnswer };
    dispatch(setQuizInfo(updatedQuizInfo));
  });
};

export const updateQuizAsync = (id: number, body: {
  quiz_name: string,
  quiz_title: string,
  quiz_description: string,
  quiz_frequency: number
}) => async () => {
  await api.quizzes.updateQuiz(id, body);
};

export const updateQuestionAsync = (id: number, body: Question) => async (dispatch: AppDispatch) => {
  await api.quizzes.updateQuestion(id, body).then(el => el.result)
    .then(el => dispatch(updateQuestion({ ...body, ...el })));
};

export const deleteQuestionAsync = (id: number) => async (dispatch: AppDispatch) => {
  await api.quizzes.deleteQuestion(id).then(() => dispatch(deleteQuestion(id)));
};

export const addQuestionAsync = (id: number, body: Question) => async (dispatch: AppDispatch) => {
  await api.quizzes.addQuestion(id, body).then(el => el.result)
    .then(el => dispatch(addQuestion({ ...body, ...el })));
};

export const deleteQuizAsync = (id: number) => async () => {
  await api.quizzes.delete(id);
};
export default QuizSlice.reducer;