import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import { NewQuiz } from 'Types/NewQuiz';
import api from '../../../Api/axiosInstance';


export interface QuizState {
  quiz: NewQuiz | null;
}

const initialState: QuizState = {
  quiz: null,
};
export const QuizSlice = createSlice({
  name: 'Quiz',
  initialState,
  reducers: {
    setQuiz: (state, action: PayloadAction<NewQuiz>) => {
      state.quiz = action.payload;
    },
  },
});

export const { setQuiz } = QuizSlice.actions;

export const selectQuiz = (state: RootState) => state.quiz.quiz;

export const createQuizAsync = (data: NewQuiz, description: string) => async (dispatch: AppDispatch) => {
  await api.quizzes.createQuiz(data)
    .then(el => {
      dispatch(setQuiz(data));
      api.quizzes.updateQuiz(el.result.quiz_id, {
        quiz_name: data.quiz_name,
        quiz_title: '',
        quiz_description: description,
        quiz_frequency: data.quiz_frequency,
      });
    });
};

export default QuizSlice.reducer;