import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { getUserAsync, selectProfile, selectUser } from 'Store/features/user/UsersSlice';
import { Avatar, Grid, Typography } from '@mui/material';
import { IoIosArrowBack } from 'react-icons/io';

const ProfilePage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserAsync(Number(id)));
  }, [id]);

  return (
    <>
      {profile.user_firstname &&
        <Grid spacing={3} justifyContent="center">
          <IoIosArrowBack onClick={() => navigate(-1)} size={36} />
          <Grid item xs={12} sm={6} md={4} sx={{ padding: 2, textAlign: 'center' }}>
            {!!profile.user_avatar ? (
              <Avatar alt={profile.user_firstname} src={profile.user_avatar}
                      sx={{ width: 120, height: 120, margin: 'auto' }} />
            ) : (
              <Avatar sx={{ width: 120, height: 120, margin: 'auto' }} />
            )}
            <Typography variant="h5" gutterBottom>
              {`${profile.user_firstname} ${profile.user_lastname}`}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              e-mail: {profile.user_email}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              city: {profile.user_city}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              phone: {profile.user_phone}
            </Typography>

          </Grid>
        </Grid>
      }
    </>
  );
}; //{user.user_id === profile.user_id ? 'ok' : 'no'}
export default ProfilePage;