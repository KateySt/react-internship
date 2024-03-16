import React, { useEffect } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { getMeAsync, selectIsLogin, selectToken, setIsLogin, setToken, setTokenAsync } from 'Store/features/user/UsersSlice';
import './AuthorizationPage.css';
import LoginButton from 'Components/auth/LoginButton';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { regExpEmail } from 'Utils/regular';
import { useAuth0 } from '@auth0/auth0-react';
import useNavigation from 'Utils/hooks/useNavigation';

const validationSchema = Yup.object().shape({
  email: Yup.string().lowercase().email('Invalid email format').matches(regExpEmail).required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const AuthorizationPage: React.FC = () => {
  const { navigateToPage, goHome } = useNavigation('/users/regist');
  const dispatch = useAppDispatch();
  const isLogin = useAppSelector(selectIsLogin);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const token = useAppSelector(selectToken);
console.log(token)
  const getToken = async () => {
    if (isAuthenticated) {
      const accessToken = await getAccessTokenSilently();
      dispatch(setToken(accessToken));
    }
  };

  useEffect(() => {
    getToken();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!token) return;
    dispatch(getMeAsync());
    dispatch(setIsLogin(true));
  }, [token]);

  const handleLogin = async (values: any) => {
    await dispatch(setTokenAsync(values.email, values.password));
  };

  if (isLogin) {
    goHome();
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
        initialValues={{ email: 'use1r@example.com', password: 'string' }}
        onSubmit={handleLogin}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <Form>
            <Field
              as={TextField}
              id="outlined-required"
              label="Email"
              variant="outlined"
              name="email"
              value={values.email}
              onChange={handleChange}
              margin="normal"
              fullWidth
              error={touched.email && !!errors.email}
            />
            <ErrorMessage name="email" component="p" />
            <Field
              as={TextField}
              id="outlined-password-input"
              label="Password"
              autoComplete="current-password"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              margin="normal"
              fullWidth
              error={touched.password && !!errors.password}
            />
            <ErrorMessage name="password" component="p" />
            <Button color="secondary" variant="contained" type="submit" fullWidth>
              Login
            </Button>
          </Form>
        )}
      </Formik>
      <Button color="secondary" onClick={navigateToPage} fullWidth>
        Registration
      </Button>
      <LoginButton />
    </Box>
  );
};
export default AuthorizationPage;
