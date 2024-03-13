import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch, useAppSelector } from '../../../Store/hooks';
import { creatUserAsync, selectToken, setTokenAsync } from '../../../Store/features/user/UsersSlice';

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const token = useAppSelector(selectToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) return;
    if (!token) {
      dispatch(creatUserAsync({
        user_password: 'string',
        user_password_repeat: 'string',
        user_email: user.email as string,
        user_firstname: user.given_name || '',
        user_lastname: user.family_name || '',
      })).catch(err => console.error(err));
      dispatch(setTokenAsync(user.email, 'string'));
    }
  }, [user]);

  if (!isAuthenticated || !user) {
    return null;
  }
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};
export default ProfilePage;