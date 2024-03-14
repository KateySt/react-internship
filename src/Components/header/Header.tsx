import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import './Header.css';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { getUser, selectToken, selectUser } from 'Store/features/user/UsersSlice';
import LogoutButton from '../auth/LogoutButton';

const Header = () => {
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [token]);

  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          My App
        </Typography>
        {user && `${user.user_email} -- ${user.user_firstname}`}
        <Button color="inherit" component={Link} to="/about">About</Button>
        {token ?
          <>
            <Button color="inherit" component={Link} to="/users/list">Users</Button>
            <Button color="inherit" component={Link} to="/companies">Companies</Button>
            <LogoutButton />
          </>
          :
          <>
            <Button color="inherit" component={Link} to="/users/auth">Login</Button>
            <Button color="inherit" component={Link} to="/users/regist">Registration</Button>
          </>}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
