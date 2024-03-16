import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import api from 'Api/axiosInstance';
import { UserList } from 'Types/UserList';
import { Profile } from 'Types/Profile';
import { NewUser } from 'Types/NewUser';
import { User } from 'Types/User';

export interface UserState {
  user: User | Profile,
  accessToken: string | null;
  users: UserList,
  isLogin: boolean;
  profile: Profile;
  avatar: any; //Todo type
}

const initialState: UserState = {
  user: {} as User | Profile,
  accessToken: null,
  users: {} as UserList,
  isLogin: false,
  profile: {} as Profile,
  avatar: null,
};

export const UsersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | Profile>) => {
      state.user = action.payload;
    },
    setProfile: (state, action: PayloadAction<Profile>) => {
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

export const getMe = () => async (dispatch: AppDispatch) => {
  await api.users.getMe().then((el) => dispatch(setUser(el.result)));
};

export const getUserAsync = (id: number) => async (dispatch: AppDispatch) => {
  await api.users.details(id).then((el) => dispatch(setProfile(el.result)));
};

export const getListUsersAsync = (param: object) => async (dispatch: AppDispatch) => {
  await api.users.list(param).then((el) => dispatch(setUsers(el.result)));
};

export const setTokenAsync = (email: string, password: string) => async (dispatch: AppDispatch) => {
  await api.users.login({ user_email: email, user_password: password })
    .then((el) => dispatch(setToken(el.result.access_token)));
};

export const creatUserAsync = (user: NewUser) => async (dispatch: AppDispatch) => {
    await api.users.create(user)
      .then((el) => dispatch(setUser({
          ...el.result,
          user_email: user.user_email,
          user_firstname: user.user_firstname,
          user_lastname: user.user_lastname,
        })),
      );
  }
;
export default UsersSlice.reducer;
;
