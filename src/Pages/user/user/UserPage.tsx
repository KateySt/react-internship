import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import {
  deleteProfileAsync,
  getListCompaniesAsync,
  getUserAsync,
  selectCompanies,
  selectCurrentUser,
  selectUser,
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
  declineActionAsync,
  getListInvitedCompanyAsync,
  selectInvitedCompany,
} from '../../../Store/features/action/ActionSlice';
import DeclineAction from '../../../Components/action/DeclineAction';

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
  const companyInvites = useAppSelector(selectInvitedCompany);
  const companies = useAppSelector(selectCompanies);
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isShowListInvite, setIsShowListInvite] = useState<boolean>(false);

  const handleDeclineAction = async (id: number) => {
    await dispatch(declineActionAsync(id));
    await dispatch(getListInvitedCompanyAsync(Number(id)));
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
    dispatch(getListCompaniesAsync(Number(id)));
  }, [id, user]);

  return (
    <>
      {currentUser && (
        <Grid justifyContent="center" margin={3}>
          <IoIosArrowBack onClick={() => navigate(-1)} size={36} />
          {user.user_id === currentUser.user_id && <>
            <MdDeleteForever onClick={handleDelete} size={36} />
            <FaThList onClick={() => setIsShowListInvite(!isShowListInvite)} size={32} />
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
                        companies={companies}
              />
            }
          </Grid>

          <DeclineAction
            isShow={isShowListInvite}
            handleClose={handleCloseModal}
            invitedUsers={companyInvites}
            handleDeclineAction={handleDeclineAction} />
        </Grid>
      )}
    </>
  );
};
export default UserPage;