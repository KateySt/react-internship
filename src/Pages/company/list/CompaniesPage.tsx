import React, { useEffect, useState } from 'react';
import PaginationComponent from 'Components/pagination/PaginationComponent';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { getListCompanyAsync, selectCompanies } from 'Store/features/company/CompaniesSlice';
import CompanyCard from 'Components/cartCompany/CompanyCard';
import StyleButton from 'Components/button/StyleButton';
import Modal from 'Components/modal';
import { Grid } from '@mui/material';

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

  const handleCreateCompany = () => {

  };

  return (
    <>
      <StyleButton text={'Add company'} onClick={handleOpenModal} />
      <PaginationComponent
        data={companies.companies}
        pagination={companies.pagination}
        nextPage={handleChange}
        url={'/companies/profile'}
        RenderComponent={CompanyCard}
        idKey={'company_id'} />
      <Modal isOpen={isShow} onClose={handleCloseModal}>
        <h2>Add company</h2>


        <Grid container spacing={2}>
          <Grid item xs={6}>
            <StyleButton onClick={handleCreateCompany} text={'Create'} />
          </Grid>
          <Grid item xs={6}>
            <StyleButton onClick={handleCloseModal} text={'Close'} />
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default CompaniesPage;