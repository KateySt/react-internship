import React from 'react';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { selectTheme, toggleTheme } from 'Store/features/ui/uiSlice';
import api from 'Api/axiosInstance';

const AboutPage = () => {
  const theme = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();
  const handelValueChange = () => {
    dispatch(toggleTheme());
    api.test.details()
      .then((el) => console.log(el))
      .catch((err) => console.log('Don`t correct input', err));
  };

  return <div onClick={handelValueChange}>{theme}</div>;
};

export default AboutPage;
