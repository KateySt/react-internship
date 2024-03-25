import React, { useState } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import { TextField } from '@mui/material';
import PhoneInput from '../phoneInput/PhoneInput';
import CityAutocomplete from '../city/CityAutocomplete';
import EditLinks from '../edit/EditLinks';
import StyleButton from '../button/StyleButton';
import { UpdateCompany } from 'Types/UpdateCompany';

const CompanyEditForm: React.FC<{
  initialCompany: UpdateCompany,
  handleUpdateInfo: (values: UpdateCompany) => void,
}> = ({
        initialCompany,
        handleUpdateInfo,
      }) => {
  const [newLink, setNewLink] = useState('');
  return (
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
  );
};

export default CompanyEditForm;