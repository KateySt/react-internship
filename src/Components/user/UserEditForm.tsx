import React, { useEffect, useState } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import { TextField } from '@mui/material';
import { setNewAvatarAsync } from 'Store/features/user/UsersSlice';
import { useAppDispatch } from 'Store/hooks';
import { UpdateUserInfo } from 'Types/UpdateUserInfo';
import { User } from 'Types/User';
import PhotoUpload from '../updatePhoto/PhotoUpload';
import EditLinks from '../edit/EditLinks';
import CityAutocomplete from '../city/CityAutocomplete';
import PhoneInput from '../phoneInput/PhoneInput';
import StyleButton from '../button/StyleButton';
import PasswordInput from '../passwordInput/PasswordInput';

interface UserEditFormProps {
  user: User;
  initialValuesUpdateInfo: UpdateUserInfo;
  onSubmit: (values: UpdateUserInfo) => void;
  validationSchema: any;
  cities: string[];
  onEditClick: () => void;
  initialValuesUpdatePassword: {
    user_password: string,
    user_password_repeat: string,
  };
  validationSchemaPassword: any;
  onSubmitPassword: (values: any) => void;
}

const UserEditForm: React.FC<UserEditFormProps> = ({
                                                           user,
                                                           initialValuesUpdateInfo,
                                                           onSubmit,
                                                           onSubmitPassword,
                                                           validationSchema,
                                                           onEditClick,
                                                           initialValuesUpdatePassword,
                                                           validationSchemaPassword,
                                                         }) => {
  const [newLink, setNewLink] = useState('');
  const [photoData, setPhotoData] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const handleSubmit = async () => {
    await dispatch(setNewAvatarAsync(photoData, user.user_id));
  };

  useEffect(() => {
    if (photoData) {
      handleSubmit();
    }
  }, [photoData]);

  return (
    <>
      <StyleButton onClick={onEditClick} text={'Exit edit mode'} />
      <PhotoUpload setPhotoData={setPhotoData} />
      <Formik
        initialValues={initialValuesUpdatePassword}
        onSubmit={onSubmitPassword}
        validationSchema={validationSchemaPassword}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <Form>
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
            <StyleButton text={'Update password'} type={'submit'} />
          </Form>
        )}
      </Formik>
      <Formik
        initialValues={initialValuesUpdateInfo}
        onSubmit={onSubmit}
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
            <PhoneInput
              value={values.user_phone}
              error={errors.user_phone} />
            <TextField
              id="outlined-required"
              label="Status"
              variant="outlined"
              name="user_status"
              value={values.user_status}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              fullWidth
              error={!!errors.user_status}
            />
            <ErrorMessage name="user_status" component="p" />
            <CityAutocomplete
              id="user-city"
              value={values.user_city}
              onChange={(newValue) => handleChange({ target: { name: 'user_city', value: newValue } })}
              onBlur={handleBlur}
              error={!!errors.user_city}
            />
            <EditLinks newLink={newLink} setNewLink={setNewLink} values={values.user_links} />
            <StyleButton text={'Update'} type={'submit'} />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default UserEditForm;
