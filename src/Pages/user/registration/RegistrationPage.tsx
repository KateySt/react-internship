import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'Store/hooks';
import { creatUserAsync, setTokenAsync } from 'Store/features/user/UsersSlice';
import { User } from 'Types/User';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { regExpEmail } from 'Utils/regular';

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
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleRegistration = async (values: User) => {
    await dispatch(creatUserAsync(values));
    await dispatch(setTokenAsync(values.user_email, values.user_password));
    setIsLogin(true);
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
        initialValues={{} as User}
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
            <TextField
              id="outlined-password-input"
              label="Password"
              autoComplete="new-password"
              type="password"
              name="user_password"
              value={values.user_password}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              fullWidth
              error={touched.user_password && !!errors.user_password}
            />
            <ErrorMessage name="user_password" component="p" />
            <TextField
              id="outlined-password-input"
              label="Password-repeat"
              autoComplete="new-password"
              type="password"
              name="user_password_repeat"
              value={values.user_password_repeat}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              fullWidth
              error={touched.user_password_repeat && !!errors.user_password_repeat}
            />
            <ErrorMessage name="user_password_repeat" component="p" />
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