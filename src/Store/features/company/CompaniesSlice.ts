import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import api from 'Api/axiosInstance';
import { CompanyList } from 'Types/CompanyList';
import { CompanyProfile } from 'Types/CompanyProfile';
import { Company } from 'Types/Company';
import { UpdateCompany } from 'Types/UpdateCompany';
import { UserInvited } from 'Types/UserInvited';
import { QuizzesInfo } from 'Types/QuizzesInfo';

export interface CompanyState {
  companies: CompanyList;
  company: CompanyProfile | null;
  members: UserInvited[];
  quizzes: QuizzesInfo[];
}

const initialState: CompanyState = {
  companies: {
    companies: [],
    pagination: {
      current_page: 1,
      total_page: 1,
      total_results: 0,
    },
  },
  company: null,
  members: [],
  quizzes: [],
};

export const CompaniesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setCompanies: (state, action: PayloadAction<CompanyList>) => {
      state.companies = action.payload;
    },
    setCompany: (state, action: PayloadAction<CompanyProfile>) => {
      state.company = action.payload;
    },
    addCompany: (state, action: PayloadAction<Company>) => {
      state.companies.companies.push(action.payload);
    },
    setInfo: (state, action: PayloadAction<UpdateCompany>) => {
      if (!state.company) return;
      state.company = { ...state.company, ...action.payload };
    },
    setNewAvatar: (state, action: PayloadAction<string>) => {
      if (!state.company) return;
      state.company.company_avatar = action.payload;
    },
    deleteCompany: (state, action: PayloadAction<number>) => {
      state.companies.companies = state.companies.companies.filter(company => company.company_id !== action.payload);
    },
    setMembers: (state, action: PayloadAction<UserInvited[]>) => {
      state.members = action.payload;
    },
    deleteMembers: (state, action: PayloadAction<number>) => {
      state.members = state.members.filter(member => member.action_id !== action.payload);
    },
    setQuizzes: (state, action: PayloadAction<QuizzesInfo[]>) => {
      state.quizzes = action.payload;
    },
  },
});

export const {
  setQuizzes,
  setCompanies,
  setMembers,
  deleteCompany,
  setNewAvatar,
  setInfo,
  addCompany,
  setCompany,
  deleteMembers,
} = CompaniesSlice.actions;

export const selectCompanies = (state: RootState) => state.companies.companies;

export const selectCompany = (state: RootState) => state.companies.company;

export const selectMembers = (state: RootState) => state.companies.members;

export const selectQuizzes = (state: RootState) => state.companies.quizzes;

export const getListCompanyAsync = (param: object) => async (dispatch: AppDispatch) => {
  await api.companies.list(param).then(el => dispatch(setCompanies(el.result)));
};

export const getCompanyAsync = (id: number) => async (dispatch: AppDispatch) => {
  await api.companies.details(id).then(el => dispatch(setCompany(el.result)));
};

export const createCompanyAsync = (data: {
  company_name: string,
  is_visible: boolean,
  company_description: string,
}) => async (dispatch: AppDispatch) => {
  const createResponse = await api.companies.create({
    company_name: data.company_name,
    is_visible: data.is_visible,
  }).then(el => dispatch(addCompany(
    {
      company_id: el.result.company_id,
      company_name: data.company_name,
      company_title: '',
      company_avatar: '',
      is_visible: data.is_visible,
    },
  )));
  const companyId = createResponse.payload.company_id;
  await dispatch(updateInfoCompanyAsync({ company_description: data.company_description } as UpdateCompany, companyId));
};

export const updateInfoCompanyAsync = (data: UpdateCompany, id: number) => async (dispatch: AppDispatch) => {
  await api.companies.updateInfo(data, id).then(() => dispatch(setInfo(data)));
};

export const setNewAvatarAsync = (avatar: File | null, id: number) => async (dispatch: AppDispatch) => {
  const formData = new FormData();
  formData.append('file', avatar as File);
  await api.companies.updateAvatar(formData, id).then((el) => dispatch(setNewAvatar(el.result)));
};

export const deleteCompanyAsync = (id: number) => async (dispatch: AppDispatch) => {
  await api.companies.deleteCompany(id).then(() => dispatch(deleteCompany(id)));
};

export const getListMembersAsync = (id: number) => async (dispatch: AppDispatch) => {
  await api.companies.listMembers(id).then(el => dispatch(setMembers(el.result.users))).catch(() => dispatch(setMembers([])));
};

export const getListQuizzesAsync = (id: number) => async (dispatch: AppDispatch) => {
  await api.companies.listQuizzes(id).then(el => dispatch(setQuizzes(el.result.quizzes))).catch(() => dispatch(setQuizzes([])));
};

export default CompaniesSlice.reducer;
