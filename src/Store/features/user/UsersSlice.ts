import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'Types/User';
import { AppDispatch, RootState } from '../../store';
import api from 'Api/axiosInstance';

export interface UserState {
  user: User,
  accessToken: string | null;
}

const initialState: UserState = {
  user: {} as User,
  accessToken: null,
};

export const UsersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const { setUser, setToken } = UsersSlice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectToken = (state: RootState) => state.users.accessToken;

export const getMe = () => async (dispatch: AppDispatch) => {
  await api.users.getMe().then((el: any) => dispatch(setUser(el.result)));
};
export const setTokenAsync = (email: string, password: string) => async (dispatch: AppDispatch) => {
  await api.users.login({ user_email: email, user_password: password })
    .then((el: any) => dispatch(setToken(el.result.access_token)));
};

export const creatUserAsync = (user: User) => async (dispatch: AppDispatch) => {
  await api.users.create(user)
    .then((el: User) => dispatch(setUser(el)));
};
export default UsersSlice.reducer;
