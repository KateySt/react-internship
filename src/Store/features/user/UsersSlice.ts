import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import api from 'Api/axiosInstance';
import { UserList } from 'Types/UserList';
import { User } from 'Types/User';
import { NewUser } from 'Types/NewUser';
import { UpdateUserInfo } from 'Types/UpdateUserInfo';

export interface UserState {
  user: User,
  accessToken: string | null;
  users: UserList,
  isLogin: boolean;
  currentUser: User;
}

const initialState: UserState = {
  user: {} as User,
  accessToken: null,
  users: {} as UserList,
  isLogin: false,
  currentUser: {} as User,
};

export const UsersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setProfile: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    setUsers: (state, action: PayloadAction<UserList>) => {
      state.users = action.payload;
    },
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    setNewAvatar: (state, action: PayloadAction<string>) => {
      state.user.user_avatar = action.payload;
    },
    setInfo: (state, action: PayloadAction<UpdateUserInfo>) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { setUser, setInfo, setNewAvatar, setProfile, setIsLogin, setToken, setUsers } = UsersSlice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectCurrentUser = (state: RootState) => state.users.currentUser;
export const selectUsers = (state: RootState) => state.users.users;
export const selectIsLogin = (state: RootState) => state.users.isLogin;
export const selectToken = (state: RootState) => state.users.accessToken;

export const setNewAvatarAsync = (avatar: File | null, id: number) => async (dispatch: AppDispatch) => {
  const formData = new FormData();
  formData.append('file', avatar as File);
  await api.users.updateAvatar(formData, id).then((el) => dispatch(setNewAvatar(el.result)));
};

export const deleteProfileAsync = (id: number) => async (dispatch: AppDispatch) => {
  await api.users.deleteProfile(id).then(() => {
    dispatch(setUser({} as User));
    dispatch(setToken(null));
    dispatch(setIsLogin(false));
  });
};

export const setInfoAsync = (data: UpdateUserInfo, id: number) => async (dispatch: AppDispatch) => {
  await api.users.updateInfo(data, id).then(() => dispatch(setInfo(data)));
};

export const setPasswordAsync = (data: {
  user_password: string,
  user_password_repeat: string
}, id: number) => async () => {
  await api.users.updatePassword(data, id);
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

export const createUserAsync = (user: NewUser) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.users.create(user);
    const newUser = {
      ...response.result,
      user_email: user.user_email,
      user_firstname: user.user_firstname,
      user_lastname: user.user_lastname,
      user_avatar: '',
      user_city: '',
      user_phone: '',
      user_links: [],
      is_superuser: false,
      user_status: '',
    };
    dispatch(setUser(newUser));
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
export default UsersSlice.reducer;
