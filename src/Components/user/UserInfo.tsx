import React from 'react';
import { Avatar, List, ListItem, ListItemText, Typography } from '@mui/material';
import { User } from 'Types/User';
import 'react-phone-input-2/lib/material.css';
import StyleButton from '../button/StyleButton';

interface UserInfoProps {
  user: User;
  isEditable: boolean;
  onEditClick: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, isEditable, onEditClick }) => {
  return (
    <>
      {!!user.user_avatar ? (
        <Avatar alt={user.user_firstname} src={user.user_avatar}
                sx={{ width: 120, height: 120, margin: 'auto' }} />
      ) : (
        <Avatar sx={{ width: 120, height: 120, margin: 'auto' }} />
      )}
      <Typography variant="h5" gutterBottom>
        {`${user.user_firstname} ${user.user_lastname}`}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        e-mail: {user.user_email}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        city: {user.user_city}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        phone: {user.user_phone}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        status: {user.user_status}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        links:
        <List>
          {user.user_links && user.user_links.map((link, index) => (
            <ListItem key={index}>
              <ListItemText primary={link} />
            </ListItem>
          ))}
        </List>
      </Typography>
      {isEditable && <StyleButton text={"Edit"} onClick={onEditClick}/>}
    </>
  );
};

export default UserInfo;
