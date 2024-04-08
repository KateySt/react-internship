import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import api from 'Api/axiosInstance';
import { UserList } from 'Types/UserList';
import { User } from 'Types/User';
import { NewUser } from 'Types/NewUser';
import { UpdateUserInfo } from 'Types/UpdateUserInfo';
import { CompanyInvited } from 'Types/CompanyInvited';

import { RatingData } from 'Types/RatingData';

export interface UserState {
  user: User,
  accessToken: string | null;
  users: UserList,
  isLogin: boolean;
  currentUser: User | null;
  companies: CompanyInvited[];
  rating: RatingData[] | null;
  lastPass: {
    quiz_id: number;
    last_quiz_pass_at: Date;
  } [];
  ratingCompany: number;
}

const initialState: UserState = {
  user: {} as User,
  accessToken: null,
  users: {
    users: [],
    pagination: {
      current_page: 1,
      total_page: 1,
      total_results: 0,
    },
  },
  isLogin: false,
  currentUser: null,
  companies: [],
  rating: null,
  lastPass: [],
  ratingCompany: 0,
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
    setCompanies: (state, action: PayloadAction<CompanyInvited[]>) => {
      state.companies = action.payload;
    },
    leaveCompany: (state, action: PayloadAction<number>) => {
      state.companies = state.companies.filter(company => company.action_id !== action.payload);
    },
    setRatingUser: (state, action: PayloadAction<RatingData[]>) => {
      state.rating = action.payload;
    },
    setLastPass: (state, action: PayloadAction<{ quizzes: { quiz_id: number; last_quiz_pass_at: Date; } [] }>) => {
      state.lastPass = action.payload.quizzes;
    },
    setRatingCompany: (state, action: PayloadAction<number>) => {
      state.ratingCompany = action.payload;
    },
  },
});

export const {
  setRatingCompany,
  setLastPass,
  setUser,
  setCompanies,
  setInfo,
  setNewAvatar,
  setProfile,
  setIsLogin,
  setToken,
  setRatingUser,
  setUsers,
  leaveCompany,
} = UsersSlice.actions;

export const selectUserCompanies = (state: RootState) => state.users.companies;
export const selectUser = (state: RootState) => state.users.user;
export const selectRating = (state: RootState) => state.users.rating;
export const selectRatingCompany = (state: RootState) => state.users.ratingCompany;
export const selectLastPass = (state: RootState) => state.users.lastPass;
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
  await api.users.delete(id).then(() => {
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

export const getListUsersAsync = (param?: object) => async (dispatch: AppDispatch) => {
  await api.users.list(param).then((el) => dispatch(setUsers(el.result)));
};

export const setTokenAsync = (email: string, password: string) => async (dispatch: AppDispatch) => {
  await api.users.login({ user_email: email, user_password: password })
    .then((el) => dispatch(setToken(el.result.access_token)));
};

export const createUserAsync = (user: NewUser) => async () => {
  await api.users.create(user);
};

export const getListCompaniesAsync = (id: number) => async (dispatch: AppDispatch) => {
  await api.users.listCompanies(id).then(el => dispatch(setCompanies(el.result.companies)));
};

export const getRatingAnalyticUserAsync = (userId: number, quizId: number) => async (dispatch: AppDispatch) => {
  await api.users.listRatingAnalyticUser(userId, quizId).then(el => dispatch(setRatingUser(el.result.rating)));
};

export const getLastPassUserAsync = (userId: number) => async (dispatch: AppDispatch) => {
  await api.users.listLastPassQuiz(userId).then(el => dispatch(setLastPass(el.result)));
};

export const getRatingAsync = (userId: number) => async (dispatch: AppDispatch) => {
  await api.users.rating(userId).then(el => dispatch(setRatingCompany(el.result.rating)));
};

export default UsersSlice.reducer;
