import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import api from 'Api/axiosInstance';
import { UserInvited } from 'Types/UserInvited';
import { CompanyInvited } from 'Types/CompanyInvited';

export interface ActionState {
  usersInvited: UserInvited[];
  companiesInvited: CompanyInvited[];
  userRequests: UserInvited[];
  companiesRequests: CompanyInvited[];
}

const initialState: ActionState = {
  usersInvited: [],
  companiesInvited: [],
  userRequests: [],
  companiesRequests: [],
};

export const ActionSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {
    setInvitedUsers: (state, action: PayloadAction<UserInvited[]>) => {
      state.usersInvited = action.payload;
    },
    setInvitedCompanies: (state, action: PayloadAction<CompanyInvited[]>) => {
      state.companiesInvited = action.payload;
    },
    setRequestsUsers: (state, action: PayloadAction<UserInvited[]>) => {
      state.userRequests = action.payload;
    },
    setRequestsCompanies: (state, action: PayloadAction<CompanyInvited[]>) => {
      state.companiesRequests = action.payload;
    },
  },
});

export const { setInvitedUsers, setRequestsCompanies, setRequestsUsers, setInvitedCompanies } = ActionSlice.actions;

export const selectInvitedUser = (state: RootState) => state.actions.usersInvited;
export const selectRequestsUser = (state: RootState) => state.actions.userRequests;
export const selectRequestsCompanies = (state: RootState) => state.actions.companiesRequests;
export const selectInvitedCompanies = (state: RootState) => state.actions.companiesInvited;
export const createActionFromCompanyAsync = (companyId: number, userId: number) => async (dispatch: AppDispatch) => {
  await api.actions.createActionFromCompany(companyId, userId);
};

export const createActionFromUserAsync = (companyId: number) => async (dispatch: AppDispatch) => {
  await api.actions.createActionFromUser(companyId);
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

export const blockRequestAsync = (id: number) => async () => {
  await api.actions.blockRequest(id);
};

export const getListRequestsUsersAsync = (companyId: number) => async (dispatch: AppDispatch) => {
  await api.companies.listRequests(companyId).then(el => dispatch(setRequestsUsers(el.result.users)));
};

export const getListRequestsCompaniesAsync = (userId: number) => async (dispatch: AppDispatch) => {
  await api.users.listRequests(userId).then(el => dispatch(setRequestsCompanies(el.result.companies)));
};

export const acceptInviteAsync = (id: number) => async () => {
  await api.actions.acceptInvite(id);
};

export const acceptRequestAsync = (id: number) => async () => {
  await api.actions.acceptRequest(id);
};

export const leaveCompanyAsync = (id: number) => async () => {
  await api.actions.leaveCompany(id);
};

export default ActionSlice.reducer;