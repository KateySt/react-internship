import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './features/user/UsersSlice';
import uiReducer from './features/ui/uiSlice';
import companiesReducer from './features/company/CompaniesSlice';
import actionsReducer from './features/action/ActionSlice';
import quizReducer from './features/quiz/QuizSliece';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    ui: uiReducer,
    companies: companiesReducer,
    actions: actionsReducer,
    quiz: quizReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
