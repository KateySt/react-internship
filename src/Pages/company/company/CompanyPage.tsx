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
import { Avatar, Grid, Typography } from '@mui/material';
import { IoIosArrowBack } from 'react-icons/io';
import StyleButton from 'Components/button/StyleButton';
import { selectUser } from 'Store/features/user/UsersSlice';
import PhotoUpload from 'Components/updatePhoto/PhotoUpload';
import { UpdateCompany } from 'Types/UpdateCompany';
import { MdDeleteForever } from 'react-icons/md';
import CompanyEditForm from 'Components/company/CompanyEditForm';

const CompanyPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const company = useAppSelector(selectCompany);
  const user = useAppSelector(selectUser);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [photoData, setPhotoData] = useState<File | null>(null);
  const handleUpdateInfo = async (values: UpdateCompany) => {
    if (!company) return;
    await dispatch(updateInfoCompanyAsync(values, company.company_id));
    setIsEdit(false);
  };
  const handleSubmit = async () => {
    if (!company) return;
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
    if (!company) return;
    if (window.confirm('Are you sure you want to delete this company?')) {
      await dispatch(deleteCompanyAsync(company.company_id));
      navigate('/companies');
    }
  };

  let initialCompany: UpdateCompany = {
    company_name: company?.company_name || '',
    company_title: company?.company_title || '',
    company_description: company?.company_description || '',
    company_city: company?.company_city || '',
    company_phone: company?.company_phone || '',
    company_links: company?.company_links || [],
  };

  return (
    <>
      {company && (
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
                <CompanyEditForm initialCompany={initialCompany} handleUpdateInfo={handleUpdateInfo} />
              </>
            }
          </>
        </Grid>
      )}
    </>
  );
};

export default CompanyPage;