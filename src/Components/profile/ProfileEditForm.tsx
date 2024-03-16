import React, { useEffect, useState } from 'react';
import { ErrorMessage, FieldArray, Form, Formik } from 'formik';
import { Autocomplete, Button, Chip, Stack, TextField } from '@mui/material';
import ReactPhoneInput from 'react-phone-input-2';
import { setNewAvatarAsync } from 'Store/features/user/UsersSlice';
import { useAppDispatch } from 'Store/hooks';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const phoneInputClass = {
  width: '100%',
  height: '60px',
  border: '1px solid #ced4da',
  borderRadius: '4px',
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface ProfileEditFormProps {
  profile: any;
  initialValues: any;
  onSubmit: (values: any) => void;
  validationSchema: any;
  cities: string[];
  onEditClick: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
                                                           profile,
                                                           initialValues,
                                                           onSubmit,
                                                           validationSchema,
                                                           cities,
                                                           onEditClick,
                                                         }) => {
  const [newLink, setNewLink] = useState('');
  const [photoData, setPhotoData] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoData(file);
    }
  };
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
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
      </Button>

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
            <div style={{ margin: '8px 0' }}>
              <ReactPhoneInput
                inputProps={{
                  name: 'user_phone',
                  id: 'user-phone',
                  onBlur: handleBlur,
                  onChange: handleChange,
                  value: values.user_phone,
                  error: !!errors.user_phone,
                }}
                inputStyle={phoneInputClass}
                country="us"
                enableSearch
                disableSearchIcon
              />
              <ErrorMessage name="user_phone" component="p" />
            </div>
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
            <Autocomplete
              id="user-city"
              options={cities}
              fullWidth
              value={values.user_city}
              onChange={(event, newValue) =>
                handleChange({
                  target: {
                    name: 'user_city',
                    value: newValue,
                  },
                })}
              onBlur={handleBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.user_city}
                />
              )}
            />
            <FieldArray name="user_links">
              {(arrayHelpers) => (
                <>
                  <TextField
                    id="user_links"
                    name="user_links"
                    label="Add Link"
                    variant="outlined"
                    fullWidth
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    onBlur={handleBlur}
                    error={!!errors.user_links}
                  />
                  <Stack direction="row" spacing={1} sx={{ marginTop: '8px' }}>
                    {values.user_links.map((link: string, index: number) => (
                      <Chip
                        key={index}
                        label={link}
                        variant="outlined"
                        onDelete={() => arrayHelpers.remove(index)}
                      />
                    ))}
                  </Stack>
                  <Button
                    type="button"
                    onClick={() => {
                      if (newLink.trim() !== '') {
                        arrayHelpers.push(newLink);
                        setNewLink('');
                      }
                    }}
                    disabled={!newLink.trim()}
                  >
                    Add
                  </Button>
                </>
              )}
            </FieldArray>

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
