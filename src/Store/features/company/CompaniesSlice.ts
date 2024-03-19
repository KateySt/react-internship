import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import api from 'Api/axiosInstance';
import { CompanyList } from 'Types/CompanyList';
import { CompanyProfile } from 'Types/CompanyProfile';

export interface CompanyState {
  companies: CompanyList;
  company: CompanyProfile;
}

const initialState: CompanyState = {
  companies: {} as CompanyList,
  company: {} as CompanyProfile,
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
  },
});

export const { setCompanies, setCompany } = CompaniesSlice.actions;

export const selectCompanies = (state: RootState) => state.companies.companies;

export const selectCompany = (state: RootState) => state.companies.company;

export const getListCompanyAsync = (param: object) => async (dispatch: AppDispatch) => {
  await api.companies.list(param).then(el => dispatch(setCompanies(el.result)));
};

export const getCompanyAsync = (id: number) => async (dispatch: AppDispatch) => {
  await api.companies.details(id).then(el => dispatch(setCompany(el.result)));
};

export default CompaniesSlice.reducer;
