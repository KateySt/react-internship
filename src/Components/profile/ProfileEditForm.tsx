import React, { useEffect, useState } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import { Button, TextField } from '@mui/material';
import { setNewAvatarAsync } from 'Store/features/user/UsersSlice';
import { useAppDispatch } from 'Store/hooks';
import { UpdateUserInfo } from 'Types/UpdateUserInfo';
import { Profile } from 'Types/Profile';
import PhotoUpload from '../updatePhoto/PhotoUpload';
import EditLinks from '../edit/EditLinks';
import CityAutocomplete from '../city/CityAutocomplete';
import PhoneInput from '../phoneInput/PhoneInput';

interface ProfileEditFormProps {
  profile: Profile;
  initialValues: UpdateUserInfo;
  onSubmit: (values: UpdateUserInfo) => void;
  validationSchema: any;
  cities: string[];
  onEditClick: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
                                                           profile,
                                                           initialValues,
                                                           onSubmit,
                                                           validationSchema,
                                                           onEditClick,
                                                         }) => {
  const [newLink, setNewLink] = useState('');
  const [photoData, setPhotoData] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const handleSubmit = async () => {
    await dispatch(setNewAvatarAsync(photoData, profile.user_id));
  };

  useEffect(() => {
    if (photoData) {
      handleSubmit();
    }
  }, [photoData]);

  return (
    <>
      <Button onClick={onEditClick}>Exit edit mode</Button>
      <PhotoUpload setPhotoData={setPhotoData} />
      <Formik
        initialValues={initialValues}
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
            <Button color="secondary" variant="contained" type="submit" fullWidth>
              Update
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ProfileEditForm;
