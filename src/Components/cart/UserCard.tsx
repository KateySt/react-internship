import React from 'react';
import { Avatar, Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import './UserCard.css';
import { User } from 'Types/User';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const initials = user.user_firstname.charAt(0) + user.user_lastname.charAt(0);
  const hasAvatar = !!user.user_avatar;

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card className="card">
        <CardContent className="content">
          <Box display="flex" justifyContent="center" mb={2}>
            {hasAvatar ? (
              <Avatar alt={user.user_firstname} src={user.user_avatar} sx={{ width: 64, height: 64 }} >
                {initials}
              </Avatar>
            ) : (
              <Avatar sx={{ width: 64, height: 64, backgroundColor: 'teal' }}>
                {initials}
              </Avatar>
            )}
          </Box>
          <Typography variant="h5" component="div" sx={{ fontSize: '1.3rem', overflowWrap: 'break-word' }}>
            {`${user.user_firstname} ${user.user_lastname}`}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ fontSize: '0.8rem', overflowWrap: 'break-word' }}>
            e-mail: {user.user_email}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default UserCard;