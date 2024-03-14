import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';
import { useAppDispatch } from 'Store/hooks';
import { setToken } from 'Store/features/user/UsersSlice';

const LogoutButton = () => {
  const { logout } = useAuth0();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await logout({ logoutParams: { returnTo: window.location.origin } });
    localStorage.clear();
    dispatch(setToken(null));
  };

  return (
    <Button color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;