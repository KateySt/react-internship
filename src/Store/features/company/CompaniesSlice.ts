import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import api from 'Api/axiosInstance';
import { CompanyList } from 'Types/CompanyList';
import { CompanyProfile } from 'Types/CompanyProfile';
import { Company } from 'Types/Company';
import { UpdateCompany } from 'Types/UpdateCompany';

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
    addCompany: (state, action: PayloadAction<Company>) => {
      state.companies.companies.push(action.payload);
    },
    setInfo: (state, action: PayloadAction<UpdateCompany>) => {
      state.company = { ...state.company, ...action.payload };
    },
    setNewAvatar: (state, action: PayloadAction<string>) => {
      state.company.company_avatar = action.payload;
    },
    deleteCompany: (state, action: PayloadAction<number>) => {
      state.companies.companies = state.companies.companies.filter(company => company.company_id !== action.payload);
    },
  },
});

export const { setCompanies, deleteCompany, setNewAvatar, setInfo, addCompany, setCompany } = CompaniesSlice.actions;

export const selectCompanies = (state: RootState) => state.companies.companies;

export const selectCompany = (state: RootState) => state.companies.company;

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

export default CompaniesSlice.reducer;
