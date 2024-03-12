import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'Types/User';
import { AppDispatch, RootState } from '../../store';

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

export const setUserAsync = (user: User) => async (dispatch: AppDispatch) => {
  // await fetch().then().catch();
  dispatch(setUser(user));
};
export default UsersSlice.reducer;
