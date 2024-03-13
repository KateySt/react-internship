import React, { useCallback, useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { selectToken, setTokenAsync } from 'Store/features/user/UsersSlice';
import './AuthorizationPage.css';
import LoginButton from 'Components/auth/LoginButton';

const AuthorizationPage = () => {
  const [email, setEmail] = useState<string>('use1r@example.com');
  const [password, setPassword] = useState<string>('string');
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);

  useEffect(() => {
    if (!token) return;
    localStorage.setItem('token', token);
  }, [token]);

  const handelValueChange = useCallback(async () => {
    await dispatch(setTokenAsync(email, password));
  }, [email, password]);

  return (
    <div>
      <TextField id="outlined-required" label="email" variant="outlined" value={email}
                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
      <TextField id="outlined-password-input" label="password" autoComplete="current-password" type="password"
                 value={password}
                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
      <Button color="secondary" onClick={handelValueChange}>Login</Button>
      <LoginButton />
    </div>
  );
};

export default AuthorizationPage;
