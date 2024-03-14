import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { selectToken, setToken } from '../../Store/features/user/UsersSlice';

const HomePage: React.FC  = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);

  useEffect(() => {
    if (!token) return;
    localStorage.setItem('token', token);
  }, [token]);

  const getToken = async () => {
    if (!isAuthenticated) return;
    const tokenData = await getAccessTokenSilently();
    dispatch(setToken(tokenData));
  };

  useEffect(() => {
    getToken();
  }, [isAuthenticated]);

  return (
    <div>
      home
    </div>
  );
};

export default HomePage;