import React, { useEffect, useState } from 'react';
import PaginationComponent from 'Components/pagination/PaginationComponent';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { createCompanyAsync, getListCompanyAsync, selectCompanies } from 'Store/features/company/CompaniesSlice';
import CompanyCard from 'Components/cartCompany/CompanyCard';
import StyleButton from 'Components/button/StyleButton';
import Modal from 'Components/modal';
import { Grid, TextField } from '@mui/material';
import { ErrorMessage, Form, Formik } from 'formik';

const CompaniesPage = () => {
  const dispatch = useAppDispatch();
  const companies = useAppSelector(selectCompanies);
  const [param, setParam] = useState<object>({ page: 1, page_size: 10 });
  const [isShow, setIsShow] = useState<boolean>(false);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setParam(prev => ({
      ...prev,
      page: value,
    }));
  };

  useEffect(() => {
    dispatch(getListCompanyAsync(param));
  }, [param]);

  const handleOpenModal = () => {
    setIsShow(!isShow);
  };

  const handleCloseModal = () => {
    setIsShow(false);
  };

  const handleCreateCompany = async (values: {
    company_name: string,
    is_visible: boolean,
    company_description: string,
  }) => {
    await dispatch(createCompanyAsync(values));
    setIsShow(false);
  };

  return (
    <>
      <StyleButton text={'Add company'} onClick={handleOpenModal} />
      <PaginationComponent
        data={companies.companies}
        pagination={companies.pagination}
        nextPage={handleChange}
        url={'/companies/company'}
        RenderComponent={CompanyCard}
        idKey={'company_id'} />
      <Modal isOpen={isShow} onClose={handleCloseModal}>
        <h2>Add company</h2>

        <Formik
          initialValues={{
            company_name: '',
            is_visible: true,
            company_description: '',
          }}
          onSubmit={handleCreateCompany}
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
                id="outlined-multiline-flexible"
                label="Description"
                name="company_description"
                value={values.company_description}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                fullWidth
                multiline
                maxRows={4}
                error={touched.company_description && !!errors.company_description}
              />
              <ErrorMessage name="company_description" component="p" />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StyleButton text={'Create'} type={'submit'} />
                </Grid>
                <Grid item xs={6}>
                  <StyleButton onClick={handleCloseModal} text={'Close'} />
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default CompaniesPage;