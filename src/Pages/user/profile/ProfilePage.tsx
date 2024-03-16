import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { getUserAsync, selectProfile, selectUser, setInfoAsync } from 'Store/features/user/UsersSlice';
import { Grid } from '@mui/material';
import { IoIosArrowBack } from 'react-icons/io';
import * as Yup from 'yup';
import { Profile } from 'Types/Profile';
import 'react-phone-input-2/lib/style.css';
import { UpdateUserInfo } from 'Types/UpdateUserInfo';
import { cities } from 'Utils/cities';
import ProfileEditForm from 'Components/profile/ProfileEditForm';
import ProfileInfo from 'Components/profile/ProfileInfo';

const validationSchema = Yup.object().shape({
  user_links: Yup.array().optional(),
  user_phone: Yup.string().max(9).optional(),
  user_status: Yup.string().max(100).optional(),
  user_city: Yup.string().optional(),
  user_firstname: Yup.string().min(4).max(64).required('First name is required'),
  user_lastname: Yup.string().min(4).max(64).required('Last name is required'),
});


const ProfilePage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const user = useAppSelector(selectUser) as Profile;
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const handleUpdateInfo = async (values: UpdateUserInfo) => {
    await dispatch(setInfoAsync(values, user.user_id));
    setIsEdit(false);
  };

  useEffect(() => {
    dispatch(getUserAsync(Number(id)));
  }, [dispatch, id]);

  return (
    <>
      {profile.user_firstname && (
        <Grid container spacing={3} justifyContent="center" margin={10}>
          <IoIosArrowBack onClick={() => navigate(-1)} size={36} />
          <Grid item xs={12} sm={6} md={4} sx={{ padding: 2, textAlign: 'center' }}>
            {!isEdit &&
              <ProfileInfo profile={profile}
                           isEditable={user.user_id === profile.user_id}
                           onEditClick={() => setIsEdit(true)} />
            }
            {isEdit && (
              <ProfileEditForm
                initialValues={{
                  user_firstname: user.user_firstname,
                  user_lastname: user.user_lastname,
                  user_status: user.user_status || '',
                  user_city: user.user_city || '',
                  user_phone: user.user_phone || '',
                  user_links: user.user_links || [],
                }}
                profile={profile}
                onSubmit={handleUpdateInfo}
                validationSchema={validationSchema}
                cities={cities}
                onEditClick={() => setIsEdit(false)}
              />
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};
export default ProfilePage;