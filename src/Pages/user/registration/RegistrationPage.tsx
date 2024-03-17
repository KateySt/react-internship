import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { createUserAsync, getMe, selectIsLogin, setIsLogin, setTokenAsync } from 'Store/features/user/UsersSlice';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { regExpEmail } from 'Utils/regular';
import { NewUser } from 'Types/NewUser';
import PasswordInput from 'Components/passwordInput/PasswordInput';

const validationSchema = Yup.object().shape({
  user_password: Yup.string().min(8).required('Password is required'),
  user_password_repeat: Yup.string().min(8)
    .oneOf([Yup.ref('user_password')], 'Passwords must match')
    .required('Password confirmation is required'),
  user_email: Yup.string().lowercase().email('Invalid email format').matches(regExpEmail).required('Email is required'),
  user_firstname: Yup.string().min(4).max(64).required('First name is required'),
  user_lastname: Yup.string().min(4).max(64).required('Last name is required'),
});

const RegistrationPage = () => {
  const isLogin = useAppSelector(selectIsLogin);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleRegistration = async (values: NewUser) => {
    try {
      await dispatch(createUserAsync(values));
    } catch (error) {
      console.error('Error:', error);
    }
    await dispatch(setTokenAsync(values.user_email, values.user_password));
    await dispatch(getMe());
    dispatch(setIsLogin(true));
  };

  if (isLogin) {
    navigate('/');
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      boxShadow={3}
      p={2}
      borderRadius={4}
      bgcolor="background.paper"
      maxWidth={400}
      margin="auto"
      mt={10}
    >
      <Formik
        initialValues={{} as NewUser}
        onSubmit={handleRegistration}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <Form>
            <TextField
              id="outlined-required"
              label="First name"
              variant="outlined"
              name="user_firstname"
              value={values.user_firstname}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              fullWidth
              error={touched.user_firstname && !!errors.user_firstname}
            />
            <ErrorMessage name="user_firstname" component="p" />
            <TextField
              id="outlined-required"
              label="Last name"
              variant="outlined"
              name="user_lastname"
              value={values.user_lastname}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              fullWidth
              error={touched.user_lastname && !!errors.user_lastname}
            />
            <ErrorMessage name="user_lastname" component="p" />
            <TextField
              id="outlined-required"
              label="Email"
              variant="outlined"
              name="user_email"
              value={values.user_email}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              fullWidth
              error={touched.user_email && !!errors.user_email}
            />
            <ErrorMessage name="user_email" component="p" />
            <PasswordInput
              name={'user_password'}
              value={values.user_password}
              onChange={handleChange}
              error={touched.user_password && !!errors.user_password} />
            <PasswordInput
              name={'user_password_repeat'}
              value={values.user_password_repeat}
              onChange={handleChange}
              error={touched.user_password_repeat && !!errors.user_password_repeat} />
            <Button color="secondary" variant="contained" type="submit" fullWidth>
              Registration
            </Button>
          </Form>
        )}
      </Formik>
      <Button color="secondary" onClick={() => navigate('/users/auth')} fullWidth>
        Login
      </Button>
    </Box>
  );
};
export default RegistrationPage;