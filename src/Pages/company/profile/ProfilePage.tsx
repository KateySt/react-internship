import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import {
  deleteCompanyAsync,
  getCompanyAsync,
  selectCompany,
  setNewAvatarAsync,
  updateInfoCompanyAsync,
} from 'Store/features/company/CompaniesSlice';
import { Avatar, Grid, TextField, Typography } from '@mui/material';
import { IoIosArrowBack } from 'react-icons/io';
import StyleButton from 'Components/button/StyleButton';
import { selectUser } from 'Store/features/user/UsersSlice';
import { ErrorMessage, Form, Formik } from 'formik';
import PhoneInput from 'Components/phoneInput/PhoneInput';
import CityAutocomplete from 'Components/city/CityAutocomplete';
import EditLinks from 'Components/edit/EditLinks';
import PhotoUpload from 'Components/updatePhoto/PhotoUpload';
import { UpdateCompany } from 'Types/UpdateCompany';
import { MdDeleteForever } from 'react-icons/md';

const ProfilePage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const company = useAppSelector(selectCompany);
  const user = useAppSelector(selectUser);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [newLink, setNewLink] = useState('');
  const [photoData, setPhotoData] = useState<File | null>(null);
  const handleUpdateInfo = async (values: UpdateCompany) => {
    await dispatch(updateInfoCompanyAsync(values, company.company_id));
    setIsEdit(false);
  };
  const handleSubmit = async () => {
    await dispatch(setNewAvatarAsync(photoData, company.company_id));
  };

  useEffect(() => {
    if (photoData) {
      handleSubmit();
    }
  }, [photoData]);

  useEffect(() => {
    dispatch(getCompanyAsync(Number(id)));
  }, [id]);

  const handleDelete = async () => {
    await dispatch(deleteCompanyAsync(company.company_id));
    navigate('/companies');
  };

  let initialCompany = {
    company_name: company.company_name,
    company_title: company.company_title || '',
    company_description: company.company_description,
    company_city: company.company_city || '',
    company_phone: company.company_phone || '',
    company_links: company.company_links || [],
  };

  return (
    <>
      {company.company_owner && (
        <Grid justifyContent="center" margin={3}>
          <IoIosArrowBack onClick={() => navigate(-1)} size={36} />
          <>
            {user.user_id === company.company_owner.user_id &&
              <>
                <StyleButton text={isEdit ? 'Exit edit mode' : 'Edit'} onClick={() => setIsEdit(!isEdit)} />
                <MdDeleteForever onClick={handleDelete} size={36} />
              </>}
            {!isEdit && <> <Typography variant="h4" gutterBottom>
              {company.company_name}
            </Typography>
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <Avatar sx={{ width: 120, height: 120, margin: 'auto' }}
                          alt={company.company_name} src={company.company_avatar} />
                </Grid>
                <Grid item>
                  <Typography variant="body1">{company.company_title}</Typography>
                  <Typography variant="body2">{company.company_city}</Typography>
                </Grid>
              </Grid>
              <Typography variant="body1">{company.company_description}</Typography>
              <Typography variant="body2">Phone: {company.company_phone}</Typography>
              {company.company_owner && (
                <Typography variant="body2">
                  Owner: {`${company.company_owner.user_firstname} ${company.company_owner.user_lastname}`}
                </Typography>
              )}
            </>}
            {isEdit &&
              <>
                <PhotoUpload setPhotoData={setPhotoData} />
                <Formik
                  initialValues={initialCompany}
                  onSubmit={handleUpdateInfo}
                >
                  {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <Form>
                      <TextField
                        id="outlined-required"
                        label="Name"
                        variant="outlined"
                        name="company_name"
                        value={values.company_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        fullWidth
                        error={touched.company_name && !!errors.company_name}
                      />
                      <ErrorMessage name="company_name" component="p" />
                      <TextField
                        id="outlined-required"
                        label="Title"
                        variant="outlined"
                        name="company_title"
                        value={values.company_title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        fullWidth
                        error={touched.company_title && !!errors.company_title}
                      />
                      <ErrorMessage name="company_title" component="p" />
                      <PhoneInput
                        name={'company_phone'}
                        value={values.company_phone}
                        error={errors.company_phone} />
                      <TextField
                        id="outlined"
                        label="Description"
                        variant="outlined"
                        name="company_description"
                        value={values.company_description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        fullWidth
                        error={!!errors.company_description}
                      />
                      <ErrorMessage name="company_description" component="p" />
                      <CityAutocomplete
                        id="company_city"
                        value={values.company_city}
                        onChange={(newValue) => handleChange({ target: { name: 'company_city', value: newValue } })}
                        onBlur={handleBlur}
                        error={!!errors.company_city}
                      />
                      <EditLinks lable={'company_links'} newLink={newLink} setNewLink={setNewLink}
                                 values={values.company_links} />
                      <StyleButton text={'Update'} type={'submit'} />
                    </Form>
                  )}
                </Formik>
              </>
            }
          </>
        </Grid>
      )}
    </>
  );
};

export default ProfilePage;