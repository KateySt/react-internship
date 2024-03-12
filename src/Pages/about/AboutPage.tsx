import React from 'react';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { selectTheme, toggleTheme } from 'Store/features/ui/uiSlice';
import axios from 'axios';

const AboutPage = () => {
  const theme = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();
  const handelValueChange = () => {
    dispatch(toggleTheme());
    axios.get('/').then((data) => data.data)
      .then((status) => console.log(status))
      .catch((err) => console.log('Don`t correct input', err));
  };
  return <div onClick={handelValueChange}>{theme}</div>;
};

export default AboutPage;
