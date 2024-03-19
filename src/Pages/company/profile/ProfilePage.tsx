import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { getCompanyAsync, selectCompany } from 'Store/features/company/CompaniesSlice';
import { Avatar, Grid, Typography } from '@mui/material';
import { IoIosArrowBack } from 'react-icons/io';

const ProfilePage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const company = useAppSelector(selectCompany);

  useEffect(() => {
    dispatch(getCompanyAsync(Number(id)));
  }, [id]);

  return (
    <>
      {company.company_owner && (
        <Grid justifyContent="center" margin={3}>
          <IoIosArrowBack onClick={() => navigate(-1)} size={36} />
          <Typography variant="h4" gutterBottom>
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
        </Grid>
      )}
    </>
  );
};

export default ProfilePage;