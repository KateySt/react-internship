import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import {
  deleteCompanyAsync,
  getCompanyAsync,
  getListMembersAsync,
  getListQuizzesAsync,
  selectCompany,
  selectMembers,
  setNewAvatarAsync,
  updateInfoCompanyAsync,
} from 'Store/features/company/CompaniesSlice';
import { Alert, Avatar, Grid, Typography } from '@mui/material';
import { IoIosArrowBack } from 'react-icons/io';
import StyleButton from 'Components/button/StyleButton';
import { getListUsersAsync, selectUser, selectUsers } from 'Store/features/user/UsersSlice';
import PhotoUpload from 'Components/updatePhoto/PhotoUpload';
import { UpdateCompany } from 'Types/UpdateCompany';
import CompanyEditForm from 'Components/company/CompanyEditForm';
import {
  acceptRequestAsync,
  createActionFromCompanyAsync,
  declineActionAsync,
  getListInvitedUsersAsync,
  getListRequestsUsersAsync,
  selectInvitedUser,
  selectRequestsUser,
} from 'Store/features/action/ActionSlice';
import SendRequest from 'Components/action/SendRequest';
import { FaThList } from 'react-icons/fa';
import Action from 'Components/action/Action';
import { FaCodePullRequest } from 'react-icons/fa6';
import { SelectChangeEvent } from '@mui/material/Select';
import { MdDeleteForever } from 'react-icons/md';
import { RiMailSendFill } from 'react-icons/ri';
import CompanyTabs from 'Components/tabItem/CompanyTabs';
import { selectResult, setResultInfo } from '../../../Store/features/quiz/QuizSliece';

const CompanyPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const company = useAppSelector(selectCompany);
  const user = useAppSelector(selectUser);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [photoData, setPhotoData] = useState<File | null>(null);
  const [isShowSendInvite, setIsShowSendInvite] = useState<boolean>(false);
  const [isShowListInvite, setIsShowListInvite] = useState<boolean>(false);
  const [isShowListRequests, setIsShowListRequests] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>(0);
  const users = useAppSelector(selectUsers);
  const invitedUsers = useAppSelector(selectInvitedUser);
  const [param, setParam] = useState<{ page: number, page_size: number }>({ page: 1, page_size: 10 });
  const userRequests = useAppSelector(selectRequestsUser);
  const members = useAppSelector(selectMembers);
  const [showAlert, setShowAlert] = useState(false);
  const result = useAppSelector(selectResult);

  useEffect(() => {
    if (result) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        dispatch(setResultInfo(null));
      }, 10000);
    }
  }, [result]);

  useEffect(() => {
    dispatch(getListUsersAsync(param));
  }, [param]);

  useEffect(() => {
    if (users.pagination
      && users.pagination.total_results !== param.page_size
      && users.pagination.total_results !== 0) {
      setParam(prev => ({ ...prev, page_size: users.pagination.total_results }));
    }
  }, [users]);

  useEffect(() => {
    if (!company) return;
    dispatch(getListMembersAsync(company.company_id));
    dispatch(getListQuizzesAsync(company.company_id));
    if (user.user_id !== company.company_owner.user_id) return;
    dispatch(getListInvitedUsersAsync(company.company_id));
    dispatch(getListRequestsUsersAsync(company.company_id));
  }, [company]);

  const handleChange = (event: SelectChangeEvent) => {
    setUserId(Number(event.target.value));
  };

  const handleCloseModal = () => {
    setIsShowSendInvite(false);
  };

  const handleCloseListInvite = () => {
    setIsShowListInvite(false);
  };

  const handleCloseListRequests = () => {
    setIsShowListRequests(false);
  };
  const handleSendInvitation = async () => {
    if (!userId || !company) return;
    await dispatch(createActionFromCompanyAsync(company.company_id, userId));
    handleCloseModal();
  };

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

  const handleBlockRequest = async (id: number) => {
    await dispatch(declineActionAsync(id));
  };

  const handleDeclineAction = async (id: number) => {
    await dispatch(declineActionAsync(id));
  };

  let initialCompany: UpdateCompany = {
    company_name: company?.company_name || '',
    company_title: company?.company_title || '',
    company_description: company?.company_description || '',
    company_city: company?.company_city || '',
    company_phone: company?.company_phone || '',
    company_links: company?.company_links || [],
  };

  const handleAcceptRequestAction = async (actionId: number) => {
    await dispatch(acceptRequestAsync(actionId));
    await dispatch(getCompanyAsync(Number(id)));
  };

  const handleDelete = async () => {
    if (!company) return;
    if (window.confirm('Are you sure you want to delete this company?')) {
      await dispatch(deleteCompanyAsync(company.company_id));
      navigate('/companies');
    }
  };

  return (
    <>
      {showAlert && result && (
        <Alert severity="success" sx={{
          position: 'fixed',
          zIndex: 9999,
          button: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,255,0,0.18)',
        }}
               onClose={() => setShowAlert(false)}>
          This is your success {result.result_score}.
        </Alert>
      )}
      {company && (
        <Grid justifyContent="center" margin={3}>
          <IoIosArrowBack onClick={() => navigate(-1)} size={36} />
          <>
            {user.user_id === company.company_owner.user_id &&
              <>
                <StyleButton text={isEdit ? 'Exit edit mode' : 'Edit'} onClick={() => setIsEdit(!isEdit)} />
                <Grid container spacing={2} justifyContent="space-between" margin="unset">
                  <Grid item xs={2}>
                    <MdDeleteForever onClick={handleDelete} size={34} />
                  </Grid>
                  <Grid item xs={2}>
                    <RiMailSendFill onClick={() => setIsShowSendInvite(!isShowSendInvite)} size={34} />
                  </Grid>
                  <Grid item xs={2}>
                    <FaThList onClick={() => setIsShowListInvite(!isShowListInvite)} size={30} />
                  </Grid>
                  <Grid item xs={2}>
                    <FaCodePullRequest onClick={() => setIsShowListRequests(!isShowListRequests)} size={30} />
                  </Grid>
                </Grid>
              </>}
            {isEdit ?
              <>
                <PhotoUpload setPhotoData={setPhotoData} />
                <CompanyEditForm initialCompany={initialCompany} handleUpdateInfo={handleUpdateInfo} />
              </>
              :
              <>
                <Grid container spacing={3}>
                  <Grid item>
                    <Avatar
                      sx={{ width: 120, height: 120 }}
                      alt={company.company_name}
                      src={company.company_avatar}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h4" gutterBottom>
                      {company.company_name}
                    </Typography>
                    <Typography variant="body1">{company.company_description}</Typography>
                    <Typography variant="body2">Phone: {company.company_phone}</Typography>
                    {user.user_id !== company.company_owner.user_id && (
                      <Typography variant="body2">
                        Owner: {`${company.company_owner.user_firstname} ${company.company_owner.user_lastname}`}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                {members &&
                  members.some(el => el.user_id === user.user_id) &&
                  <CompanyTabs />}
                <SendRequest
                  handleCloseModal={handleCloseModal}
                  isShow={isShowSendInvite}
                  id={userId}
                  handleChange={handleChange}
                  data={users.users}
                  label={'User'}
                  handleSendRequest={handleSendInvitation}
                />

                <Action
                  isShow={isShowListInvite}
                  handleClose={handleCloseListInvite}
                  data={invitedUsers}
                  handleDeclineAction={handleDeclineAction} />

                <Action
                  isShow={isShowListRequests}
                  handleClose={handleCloseListRequests}
                  data={userRequests}
                  handleDeclineAction={handleBlockRequest}
                  handleAcceptAction={handleAcceptRequestAction} />
              </>
            }
          </>
        </Grid>
      )}
    </>
  );
};

export default CompanyPage;