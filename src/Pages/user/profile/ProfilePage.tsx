import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { getUser, selectProfile, selectUser } from 'Store/features/user/UsersSlice';
import { Avatar, Grid, Paper, Typography } from '@mui/material';

const ProfilePage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    dispatch(getUser(Number(id)));
  }, [id]);

  return (
    <>
      {profile.user_firstname &&
        <Grid spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
              <Avatar alt={profile.user_firstname} src={profile.user_avatar || 'placeholder.jpg'}
                      sx={{ width: 120, height: 120, margin: 'auto' }}>
                {`${profile.user_firstname.charAt(0).toUpperCase()}${profile.user_lastname.charAt(0).toUpperCase()}`}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {`${profile.user_firstname} ${profile.user_lastname}`}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                e-mail: {profile.user_email}
              </Typography>
              {user.user_id === profile.user_id ? 'ok' : 'no'}
            </Paper>
          </Grid>
        </Grid>
      }
    </>
  );
};
export default ProfilePage;