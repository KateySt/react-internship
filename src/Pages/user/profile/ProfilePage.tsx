import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { getUser, selectProfile, selectUser } from 'Store/features/user/UsersSlice';

const ProfilePage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    dispatch(getUser(Number(id)));
  }, [id]);

  console.log(profile);
  console.log(user)
  return (
    <div>
      profile
    </div>
  );
};
export default ProfilePage;