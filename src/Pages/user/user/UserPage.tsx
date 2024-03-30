import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import {
  deleteProfileAsync,
  getListCompaniesAsync,
  getUserAsync,
  selectCurrentUser,
  selectUser,
  selectUserCompanies,
  setInfoAsync,
  setPasswordAsync,
} from 'Store/features/user/UsersSlice';
import { Grid } from '@mui/material';
import { IoIosArrowBack } from 'react-icons/io';
import * as Yup from 'yup';
import 'react-phone-input-2/lib/style.css';
import { UpdateUserInfo } from 'Types/UpdateUserInfo';
import { cities } from 'Utils/cities';
import UserEditForm from 'Components/user/UserEditForm';
import UserInfo from 'Components/user/UserInfo';
import { MdDeleteForever } from 'react-icons/md';
import { FaThList } from 'react-icons/fa';
import {
  acceptInviteAsync,
  createActionFromUserAsync,
  declineActionAsync,
  getListInvitedCompanyAsync,
  getListRequestsCompaniesAsync,
  leaveCompanyAsync,
  selectInvitedCompanies,
  selectRequestsCompanies,
} from 'Store/features/action/ActionSlice';
import Action from 'Components/action/Action';
import { SelectChangeEvent } from '@mui/material/Select';
import { getListCompanyAsync, selectCompanies } from 'Store/features/company/CompaniesSlice';
import { FcInvite } from 'react-icons/fc';
import { FaCodePullRequest } from 'react-icons/fa6';
import SendRequest from 'Components/action/SendRequest';

const validationSchema = Yup.object().shape({
  user_links: Yup.array().optional(),
  user_phone: Yup.string().max(12).optional(),
  user_status: Yup.string().max(100).optional(),
  user_city: Yup.string().optional(),
  user_firstname: Yup.string().min(4).max(64).required('First name is required'),
  user_lastname: Yup.string().min(4).max(64).required('Last name is required'),
});

const validationSchemaPassword = Yup.object().shape({
  user_password: Yup.string().min(8).required('Password is required'),
  user_password_repeat: Yup.string().min(8)
    .oneOf([Yup.ref('user_password')], 'Passwords must match')
    .required('Password confirmation is required'),
});

const UserPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const user = useAppSelector(selectUser);
  const userCompanies = useAppSelector(selectUserCompanies);
  const companyInvites = useAppSelector(selectInvitedCompanies);
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isShowListInvite, setIsShowListInvite] = useState<boolean>(false);
  const companies = useAppSelector(selectCompanies);
  const [param, setParam] = useState<{ page: number, page_size: number }>({ page: 1, page_size: 10 });
  const [isShow, setIsShow] = useState<boolean>(false);
  const [companyId, setCompanyId] = useState<number>(0);
  const [isShowListRequests, setIsShowListRequests] = useState<boolean>(false);
  const companiesRequests = useAppSelector(selectRequestsCompanies);
  const handleCloseListRequests = () => {
    setIsShowListRequests(false);
  };

  const handleBlockRequest = async (actionId: number) => {
    await dispatch(declineActionAsync(actionId));
  };

  const handleSendInvitation = async () => {
    if (!companyId) return;
    await dispatch(createActionFromUserAsync(companyId));
    setIsShow(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setCompanyId(Number(event.target.value));
  };

  useEffect(() => {
    dispatch(getListCompanyAsync(param));
  }, [param]);

  useEffect(() => {
    if (companies.pagination
      && companies.pagination.total_results !== param.page_size
      && companies.pagination.total_results !== 0) {
      setParam(prev => ({ ...prev, page_size: companies.pagination.total_results }));
    }
  }, [companies]);

  const handleDeclineAction = async (actionId: number) => {
    await dispatch(declineActionAsync(actionId));
  };
  const handleUpdateInfo = async (values: UpdateUserInfo) => {
    await dispatch(setInfoAsync(values, user.user_id));
    setIsEdit(false);
  };

  const handleCloseModal = () => {
    setIsShowListInvite(false);
  };

  const handleUpdatePassword = async (values: any) => {
    await dispatch(setPasswordAsync(values, user.user_id));
  };

  const handleDelete = async () => {
    await dispatch(deleteProfileAsync(user.user_id));
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    dispatch(getUserAsync(Number(id)));
  }, [id]);

  useEffect(() => {
    dispatch(getListCompaniesAsync(Number(id)));
    dispatch(getListInvitedCompanyAsync(Number(id)));
    dispatch(getListRequestsCompaniesAsync(Number(id)));
  }, [companyId]);

  const handleAcceptInviteAction = async (actionId: number) => {
    await dispatch(acceptInviteAsync(actionId));
    await dispatch(getUserAsync(Number(id)));
  };

  const handleLeaveCompany = async (actionId: number) => {
    if (currentUser && user.user_id !== currentUser.user_id) return;
    if (window.confirm('Are you sure you want to leave this company?')) {
      await dispatch(leaveCompanyAsync(actionId));
    }
  };

  return (
    <>
      {currentUser && (
        <Grid justifyContent="center" margin={3}>
          <IoIosArrowBack onClick={() => navigate(-1)} size={36} />
          {user.user_id === currentUser.user_id && <>
            <MdDeleteForever onClick={handleDelete} size={36} />
            <FcInvite onClick={() => setIsShow(!isShow)} size={36} />
            <FaThList onClick={() => setIsShowListInvite(!isShowListInvite)} size={32} />
            <FaCodePullRequest onClick={() => setIsShowListRequests(!isShowListRequests)} size={32} />
          </>}
          <Grid item xs={12} sm={6} md={4} sx={{ padding: 2, textAlign: 'center' }}>
            {isEdit ?
              <UserEditForm
                initialValuesUpdateInfo={{
                  user_firstname: user.user_firstname,
                  user_lastname: user.user_lastname,
                  user_status: user.user_status || '',
                  user_city: user.user_city || '',
                  user_phone: user.user_phone || '',
                  user_links: user.user_links || [],
                }}
                initialValuesUpdatePassword={{
                  user_password: '',
                  user_password_repeat: '',
                }}
                user={currentUser}
                onSubmitPassword={handleUpdatePassword}
                onSubmit={handleUpdateInfo}
                validationSchema={validationSchema}
                validationSchemaPassword={validationSchemaPassword}
                cities={cities}
                onEditClick={() => setIsEdit(false)}
              />
              :
              <UserInfo user={currentUser}
                        isEditable={user.user_id === currentUser.user_id}
                        onEditClick={() => setIsEdit(true)}
                        companies={userCompanies}
                        handleLeaveCompany={handleLeaveCompany}
              />
            }
          </Grid>

          <Action
            isShow={isShowListInvite}
            handleClose={handleCloseModal}
            data={companyInvites}
            handleDeclineAction={handleDeclineAction}
            handleAcceptAction={handleAcceptInviteAction}
          />

          <SendRequest
            handleCloseModal={() => setIsShow(false)}
            isShow={isShow}
            id={companyId}
            handleChange={handleChange}
            data={companies.companies}
            label={'Company'}
            handleSendRequest={handleSendInvitation}
          />

          <Action
            isShow={isShowListRequests}
            handleClose={handleCloseListRequests}
            data={companiesRequests}
            handleDeclineAction={handleBlockRequest}
          />

        </Grid>
      )}
    </>
  );
};
export default UserPage;