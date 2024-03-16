import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'Types/User';
import { AppDispatch, RootState } from '../../store';
import api from 'Api/axiosInstance';
import { UserList } from 'Types/UserList';

export interface UserState {
  user: User,
  accessToken: string | null;
  users: UserList,
  isLogin: boolean;
  profile: User;
  avatar: any; //Todo type
}

const initialState: UserState = {
  user: {} as User,
  accessToken: null,
  users: {} as UserList,
  isLogin: false,
  profile: {} as User,
  avatar: null,
};

export const UsersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    setToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUsers: (state, action: PayloadAction<UserList>) => {
      state.users = action.payload;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setNewAvatar: (state, action) => {
      state.avatar = action.payload;
    },
  },
});

export const { setUser, setNewAvatar, setProfile, setIsLogin, setToken, setUsers } = UsersSlice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectAvatar = (state: RootState) => state.users.avatar;
export const selectProfile = (state: RootState) => state.users.profile;
export const selectUsers = (state: RootState) => state.users.users;
export const selectIsLogin = (state: RootState) => state.users.isLogin;
export const selectToken = (state: RootState) => state.users.accessToken;

export const setNewAvatarAsync = (avatar: any, id: number) => async (dispatch: AppDispatch) => {
  await api.users.updateAvatar(avatar, id).then((el: any) => dispatch(setNewAvatar(el.result)));//TODO
};

export const getMeAsync = () => async (dispatch: AppDispatch) => {
  await api.users.getMe().then((el: any) => dispatch(setUser(el.result)));
};

export const getUserAsync = (id: number) => async (dispatch: AppDispatch) => {
  await api.users.details(id).then((el: any) => dispatch(setProfile(el.result)));
};

export const getListUsersAsync = (param: object) => async (dispatch: AppDispatch) => {
  await api.users.list(param).then((el: any) => dispatch(setUsers(el.result)));
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
