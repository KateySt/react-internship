import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import {
  deleteCompanyAsync,
  getCompanyAsync,
  getListMembersAsync,
  selectCompany,
  selectMembers,
  setNewAvatarAsync,
  updateInfoCompanyAsync,
} from 'Store/features/company/CompaniesSlice';
import {
  Avatar,
  Chip,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { IoIosArrowBack } from 'react-icons/io';
import StyleButton from 'Components/button/StyleButton';
import { getListUsersAsync, selectUser, selectUsers } from 'Store/features/user/UsersSlice';
import PhotoUpload from 'Components/updatePhoto/PhotoUpload';
import { UpdateCompany } from 'Types/UpdateCompany';
import CompanyEditForm from 'Components/company/CompanyEditForm';
import { FcInvite } from 'react-icons/fc';
import {
  acceptRequestAsync,
  addAdminAsync,
  createActionFromCompanyAsync,
  declineActionAsync,
  getListInvitedUsersAsync,
  getListRequestsUsersAsync,
  leaveCompanyAsync,
  removeAdminAsync,
  selectInvitedUser,
  selectRequestsUser,
} from 'Store/features/action/ActionSlice';
import SendRequest from 'Components/action/SendRequest';
import { FaThList } from 'react-icons/fa';
import Action from 'Components/action/Action';
import { FaCodePullRequest } from 'react-icons/fa6';
import { UserInvited } from 'Types/UserInvited';
import { SelectChangeEvent } from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import { MdDeleteForever } from 'react-icons/md';

const label = { inputProps: { 'aria-label': 'Color switch demo' } };

const CompanyPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const company = useAppSelector(selectCompany);
  const members = useAppSelector(selectMembers);
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

  const handleChangeSwitch = async (event: React.ChangeEvent<HTMLInputElement>, actionId: number) => {
    if (event.target.checked) {
      await dispatch(addAdminAsync(actionId));
    } else {
      await dispatch(removeAdminAsync(actionId));
    }
    dispatch(getListMembersAsync(Number(id)));
  };

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
    if (company && user.user_id === company.company_owner.user_id) {
      dispatch(getListInvitedUsersAsync(company.company_id));
      dispatch(getListRequestsUsersAsync(company.company_id));
      dispatch(getListMembersAsync(company.company_id));
    }
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

  const handleDelete = async () => {
    if (!company) return;
    if (window.confirm('Are you sure you want to delete this company?')) {
      await dispatch(deleteCompanyAsync(company.company_id));
      navigate('/companies');
    }
  };

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

  const handleDeleteUser = async (actionId: number) => {
    if (company && user.user_id !== company.company_owner.user_id) return;
    if (window.confirm('Are you sure you want to delete this user?')) {
      await dispatch(leaveCompanyAsync(actionId));
    }
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
                <Grid container spacing={2} justifyContent="space-between" margin="unset">
                  <Grid item xs={2}>
                    <MdDeleteForever onClick={handleDelete} size={34} />
                  </Grid>
                  <Grid item xs={2}>
                    <FcInvite onClick={() => setIsShowSendInvite(!isShowSendInvite)} size={36} />
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
                {user.user_id === company.company_owner.user_id &&
                  members &&
                  (<TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>User First Name</TableCell>
                            <TableCell>User Last Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Change role</TableCell>
                            <TableCell>Delete</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {members.map((member: UserInvited, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{member.user_firstname}</TableCell>
                              <TableCell>{member.user_lastname}</TableCell>
                              <TableCell>
                                <Chip
                                  label={member.action}
                                  variant="outlined"
                                  style={{
                                    color: member.action === 'admin' ? 'red' : member.action === 'member' ? 'green' : 'gold',
                                    borderColor: member.action === 'admin' ? 'red' : member.action === 'member' ? 'green' : 'gold',
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                {user.user_id !== member.user_id && (
                                  <Switch
                                    {...label}
                                    checked={member.action === 'admin'}
                                    color="secondary"
                                    onChange={(e) => handleChangeSwitch(e, member.action_id)}
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                {user.user_id !== member.user_id && (
                                  <IconButton
                                    onClick={() => {
                                      if (user.user_id !== member.user_id) {
                                        handleDeleteUser(member.action_id);
                                      }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
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