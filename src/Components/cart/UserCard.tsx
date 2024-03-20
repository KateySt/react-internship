import React from 'react';
import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import './UserCard.css';
import { UserInfo } from 'Types/UserInfo';

const UserCard: React.FC<{ data: UserInfo }> = ({ data }) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card className="card">
        <CardContent className="content">
          <Box display="flex" justifyContent="center" mb={2}>
            {!!data.user_avatar ? (
              <Avatar alt={data.user_firstname} src={data.user_avatar} sx={{ width: 64, height: 64 }} />
            ) : (
              <Avatar sx={{ width: 64, height: 64 }} />
            )}
          </Box>
          <Typography variant="h5" component="div" sx={{ fontSize: '1.3rem', overflowWrap: 'break-word' }}>
            {`${data.user_firstname} ${data.user_lastname}`}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ fontSize: '0.8rem', overflowWrap: 'break-word' }}>
            e-mail: {data.user_email}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default UserCard;