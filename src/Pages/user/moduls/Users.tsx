import { Route, Routes } from 'react-router-dom';
import UsersPage from '../list';
import ProfilePage from '../profile';
import AuthorizationPage from '../authorization';
import RegistrationPage from '../registration';
import React from 'react';
import { useAppSelector } from 'Store/hooks';
import { selectToken } from 'Store/features/user/UsersSlice';

export default function Users() {
  const token = useAppSelector(selectToken);
  return (
    <Routes>
      {token &&
        <>
          <Route path="/list" element={<UsersPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </>
      }
      <Route path="auth" element={<AuthorizationPage />} />
      <Route path="regist" element={<RegistrationPage />} />
    </Routes>
  );
}