import React from 'react';
import { Avatar, List, ListItem, ListItemText, Typography } from '@mui/material';
import { User } from 'Types/User';
import 'react-phone-input-2/lib/material.css';
import StyleButton from '../button/StyleButton';

interface ProfileInfoProps {
  profile: User;
  isEditable: boolean;
  onEditClick: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile, isEditable, onEditClick }) => {
  return (
    <>
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
      <Typography variant="body1" color="textSecondary">
        status: {profile.user_status}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        links:
        <List>
          {profile.user_links && profile.user_links.map((link, index) => (
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

export default ProfileInfo;
