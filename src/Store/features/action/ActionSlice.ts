import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import api from 'Api/axiosInstance';
import { UserInvited } from 'Types/UserInvited';
import { CompanyInvited } from 'Types/CompanyInvited';

export interface ActionState {
  users: UserInvited[];
  companies: CompanyInvited[];
}

const initialState: ActionState = {
  users: [],
  companies: [],
};

export const ActionSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {
    setInvitedUsers: (state, action: PayloadAction<UserInvited[]>) => {
      state.users = action.payload;
    },
    setInvitedCompanies: (state, action: PayloadAction<CompanyInvited[]>) => {
      state.companies = action.payload;
    },
  },
});

export const { setInvitedUsers, setInvitedCompanies } = ActionSlice.actions;

export const selectInvitedUser = (state: RootState) => state.actions.users;
export const selectInvitedCompany = (state: RootState) => state.actions.companies;
export const createActionFromCompanyAsync = (companyId: number, userId: number) => async (dispatch: AppDispatch) => {
  await api.actions.createActionFromCompany(companyId, userId);
};

export const getListInvitedUsersAsync = (companyId: number) => async (dispatch: AppDispatch) => {
  await api.actions.companyListInvites(companyId).then(el => dispatch(setInvitedUsers(el.result.users)));
};

export const getListInvitedCompanyAsync = (userId: number) => async (dispatch: AppDispatch) => {
  await api.actions.userListInvites(userId).then(el => dispatch(setInvitedCompanies(el.result.companies)));
};

export const declineActionAsync = (id: number) => async () => {
  await api.actions.declineAction(id);
};

export default ActionSlice.reducer;