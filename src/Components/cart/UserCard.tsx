import React from 'react';
import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import './UserCard.css';
import { User } from 'Types/User';

interface UserCardProps {
  user: User & { user_avatar: string };
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card className="card">
        <CardContent className="content">
          <Box display="flex" justifyContent="center" mb={2}>
            {!!user.user_avatar ? (
              <Avatar alt={user.user_firstname} src={user.user_avatar} sx={{ width: 64, height: 64 }}/>
            ) : (
              <Avatar sx={{ width: 64, height: 64 }}/>
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