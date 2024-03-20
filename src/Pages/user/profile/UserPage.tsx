import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import {
  deleteProfileAsync,
  getUserAsync,
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
import ProfileEditForm from 'Components/profile/ProfileEditForm';
import ProfileInfo from 'Components/profile/ProfileInfo';
import { MdDeleteForever } from 'react-icons/md';

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
  const profile = useAppSelector(selectCurrentUser);
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const handleUpdateInfo = async (values: UpdateUserInfo) => {
    await dispatch(setInfoAsync(values, user.user_id));
    setIsEdit(false);
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
  }, [id, user]);

  return (
    <>
      {profile.user_firstname && (
        <Grid justifyContent="center" margin={3}>
          <IoIosArrowBack onClick={() => navigate(-1)} size={36} />
          {user.user_id === profile.user_id && <MdDeleteForever onClick={handleDelete} size={36} />}
          <Grid item xs={12} sm={6} md={4} sx={{ padding: 2, textAlign: 'center' }}>
            {isEdit ?
              <ProfileEditForm
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
                user={profile}
                onSubmitPassword={handleUpdatePassword}
                onSubmit={handleUpdateInfo}
                validationSchema={validationSchema}
                validationSchemaPassword={validationSchemaPassword}
                cities={cities}
                onEditClick={() => setIsEdit(false)}
              />
              :
              <ProfileInfo user={profile}
                           isEditable={user.user_id === profile.user_id}
                           onEditClick={() => setIsEdit(true)} />
            }
          </Grid>
        </Grid>
      )}
    </>
  );
};
export default UserPage;