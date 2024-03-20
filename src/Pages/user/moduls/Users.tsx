import { Route, Routes } from 'react-router-dom';
import UsersPage from '../list';
import UserPage from '../profile';
import AuthorizationPage from '../authorization';
import RegistrationPage from '../registration';
import React from 'react';
import { useAppSelector } from 'Store/hooks';
import { selectIsLogin } from 'Store/features/user/UsersSlice';

export default function Users() {
  const isLogin = useAppSelector(selectIsLogin);
  return (
    <Routes>
      {isLogin ?
        <>
          <Route path="list" element={<UsersPage />} />
          <Route path='profile/:id' element={<UserPage />}/>
        </>
        : <></>
      }
      <Route path="auth" element={<AuthorizationPage />} />
      <Route path="regist" element={<RegistrationPage />} />
    </Routes>
  );
}