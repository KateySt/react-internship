import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import api from 'Api/axiosInstance';
import { UserInvited } from 'Types/UserInvited';
import { CompanyInvited } from 'Types/CompanyInvited';
import { leaveCompany } from '../user/UsersSlice';
import { deleteMembers } from '../company/CompaniesSlice';

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
    deleteInvitedUsers: (state, action: PayloadAction<number>) => {
      state.usersInvited = state.usersInvited.filter(user => user.action_id !== action.payload);
    },
    deleteInvitedCompanies: (state, action: PayloadAction<number>) => {
      state.companiesInvited = state.companiesInvited.filter(company => company.action_id !== action.payload);
    },
    deleteRequestsUsers: (state, action: PayloadAction<number>) => {
      state.userRequests = state.userRequests.filter(user => user.action_id !== action.payload);
    },
    deleteCompaniesRequests: (state, action: PayloadAction<number>) => {
      state.companiesRequests = state.companiesRequests.filter(company => company.action_id !== action.payload);
    },
  },
});

export const {
  setInvitedUsers,
  deleteCompaniesRequests,
  deleteRequestsUsers,
  deleteInvitedUsers,
  deleteInvitedCompanies,
  setRequestsCompanies,
  setRequestsUsers,
  setInvitedCompanies,
} = ActionSlice.actions;

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

export const declineActionAsync = (id: number) => async (dispatch: AppDispatch) => {
  await api.actions.declineAction(id).then(() => {
    dispatch(deleteInvitedUsers(id));
    dispatch(deleteRequestsUsers(id));
    dispatch(deleteCompaniesRequests(id));
    dispatch(deleteInvitedCompanies(id));
  });
};

export const getListRequestsUsersAsync = (companyId: number) => async (dispatch: AppDispatch) => {
  await api.companies.listRequests(companyId).then(el => dispatch(setRequestsUsers(el.result.users)));
};

export const getListRequestsCompaniesAsync = (userId: number) => async (dispatch: AppDispatch) => {
  await api.users.listRequests(userId).then(el => dispatch(setRequestsCompanies(el.result.companies)));
};

export const acceptInviteAsync = (id: number) => async (dispatch: AppDispatch) => {
  await api.actions.acceptInvite(id).then(el => dispatch(deleteInvitedUsers(el.result.action_id)));
};

export const acceptRequestAsync = (id: number) => async (dispatch: AppDispatch) => {
  await api.actions.acceptRequest(id).then(el => dispatch(deleteCompaniesRequests(el.result.action_id)));
};

export const leaveCompanyAsync = (id: number) => async (dispatch: AppDispatch) => {
  await api.actions.leaveCompany(id).then(() => {
    dispatch(leaveCompany(id));
    dispatch(deleteMembers(id));
  });
};

export default ActionSlice.reducer;