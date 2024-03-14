import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch } from 'Store/hooks';
import { getMe, setToken } from 'Store/features/user/UsersSlice';

const HomePage: React.FC = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const dispatch = useAppDispatch();
  const getToken = async () => {
    if (!isAuthenticated) return;
    const tokenData = await getAccessTokenSilently();
    dispatch(setToken(tokenData));
    await dispatch(getMe());
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