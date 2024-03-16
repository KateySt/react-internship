import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import {
  getUserAsync,
  selectProfile,
  selectUser,
  setInfoAsync,
  setNewAvatarAsync,
} from 'Store/features/user/UsersSlice';
import {
  Autocomplete,
  Avatar,
  Button,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { IoIosArrowBack } from 'react-icons/io';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ErrorMessage, FieldArray, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Profile } from 'Types/Profile';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { UpdateUserInfo } from 'Types/UpdateUserInfo';
import { cities } from 'Utils/cities';

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

const validationSchema = Yup.object().shape({
  user_links: Yup.array().optional(),
  user_phone: Yup.string().max(9).optional(),
  user_status: Yup.string().max(100).optional(),
  user_city: Yup.string().optional(),
  user_firstname: Yup.string().min(4).max(64).required('First name is required'),
  user_lastname: Yup.string().min(4).max(64).required('Last name is required'),
});


const phoneInputClass = {
  width: '100%',
  height: '60px',
  border: '1px solid #ced4da',
  borderRadius: '4px',
};

const ProfilePage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const user = useAppSelector(selectUser) as Profile;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const navigate = useNavigate();
  const [photoData, setPhotoData] = useState<File | null>(null);
  const [newLink, setNewLink] = useState('');
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoData(file);
    }
  };

  const handleUpdateInfo = async (values: UpdateUserInfo) => {
    await dispatch(setInfoAsync(values, user.user_id));
    setIsEdit(false);
  };

  const handleSubmit = useCallback(async () => {
    await dispatch(setNewAvatarAsync(photoData, user.user_id));
  }, [photoData]);

  useEffect(() => {
    dispatch(getUserAsync(Number(id)));
  }, [id]);

  return (
    <>
      {profile.user_firstname &&
        <Grid spacing={3} justifyContent="center">
          <IoIosArrowBack onClick={() => navigate(-1)} size={36} />
          <Grid item xs={12} sm={6} md={4} sx={{ padding: 2, textAlign: 'center' }}>
            {!isEdit &&
              <>
                {!!profile.user_avatar ? (
                  <Avatar alt={profile.user_firstname} src={profile.user_avatar}
                          sx={{ width: 120, height: 120, margin: 'auto' }} />
                ) : (
                  <Avatar sx={{ width: 120, height: 120, margin: 'auto' }} />
                )}
                <Typography variant="h5" gutterBottom>
                  {`${profile.user_firstname} ${profile.user_lastname}`}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  e-mail: {profile.user_email}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  city: {profile.user_city}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  phone: {profile.user_phone}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  status: {profile.user_status}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  links:
                  <List>
                    {profile.user_links && profile.user_links.map((link, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={link} />
                      </ListItem>
                    ))}
                  </List>
                </Typography>
                {(user.user_id === profile.user_id) && <Button onClick={() => setIsEdit(true)}>Edit</Button>}
              </>
            }
            {(user.user_id === profile.user_id) && isEdit &&
              (
                <>
                  <Button onClick={() => setIsEdit(false)}>Exit edit mode</Button>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    onClick={handleSubmit}
                  >
                    <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                  </Button>

                  <Formik
                    initialValues={{
                      user_firstname: user.user_firstname,
                      user_lastname: user.user_lastname,
                      user_status: user.user_status || '',
                      user_city: user.user_city || '',
                      user_phone: user.user_phone || '',
                      user_links: user.user_links || [],
                    }}
                    onSubmit={handleUpdateInfo}
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
                              helperText={touched.user_city && errors.user_city}
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
                                helperText={errors.user_links}
                              />
                              <Stack direction="row" spacing={1} sx={{ marginTop: '8px' }}>
                                {values.user_links.map((link, index) => (
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
              )}
          </Grid>
        </Grid>
      }
    </>
  );
};
export default ProfilePage;