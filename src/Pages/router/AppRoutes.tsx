import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React, { useEffect } from 'react';
import { getMe, selectToken, setIsLogin, setToken } from 'Store/features/user/UsersSlice';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from 'Components/header';
import HomePage from '../home';
import AboutPage from '../about';
import Users from '../user/moduls/Users';
import Companies from '../company/moduls/Companies';
import NotFoundPage from '../error';

const AppRoutes: React.FC = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);

  useEffect(() => {
    if (!token) return;
    localStorage.setItem('token', token);
  }, [token]);

  useEffect(() => {
    let tokenData = localStorage.getItem('token');
    if (!tokenData) return;
    dispatch(setToken(tokenData));
    dispatch(getMe());
    dispatch(setIsLogin(true));
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/users/*" element={<Users />} />
        {token && <Route path="/companies/*" element={<Companies />} />}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
        <Route path="/not-found" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;