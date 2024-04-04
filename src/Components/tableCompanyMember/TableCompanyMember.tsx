import React, { useEffect, useState } from 'react';
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { UserInvited } from 'Types/UserInvited';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import { User } from 'Types/User';
import IconButton from '@mui/material/IconButton';
import { FaChartBar } from 'react-icons/fa';
import {
  getListLastPassUserAsync,
  getListRatingUserAsync,
  selectCompany,
  selectLastPass,
  selectRatingQuiz,
} from 'Store/features/company/CompaniesSlice';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import Modal from '../modal';
import BarChart from '../chart/BarChart';
import StyleButton from '../button/StyleButton';

const label = { inputProps: { 'aria-label': 'Color switch demo' } };
const TableCompanyMember: React.FC<{
  members: UserInvited[],
  user: User,
  handleChangeSwitch: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void,
  handleDeleteUser: (id: number) => void
}> = ({
        members,
        user,
        handleChangeSwitch,
        handleDeleteUser,
      }) => {
  const currentMember = members.find(el => el.user_id === user.user_id);
  const [isChart, setIsChart] = useState<boolean>(false);
  const company = useAppSelector(selectCompany);
  const ratingQuiz = useAppSelector(selectRatingQuiz);
  const lastPass = useAppSelector(selectLastPass);
  const dispatch = useAppDispatch();
  const handleChart = async (userId: number) => {
    if (!company) return;
    await dispatch(getListRatingUserAsync(company.company_id, userId));
    setIsChart(true);
  };

  useEffect(() => {
    if (!company) return;
    if (currentMember && (currentMember.action === 'owner' || currentMember.action === 'admin')) {
      dispatch(getListLastPassUserAsync(company.company_id));
    }
  }, [company]);

  return (
    <>
      {ratingQuiz &&
        <Modal isOpen={isChart} onClose={() => setIsChart(false)}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            borderRadius: '2%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: 600,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}>
            <Typography variant="h5" textAlign="center">Charts</Typography>
            {ratingQuiz.rating.map((el) => <BarChart data={el} />)}
            <StyleButton onClick={() => setIsChart(false)} text={'Close'} />
          </Box>
        </Modal>
      }
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Role</TableCell>
              {currentMember && (currentMember.action === 'owner' || currentMember.action === 'admin') &&
                <>
                  <TableCell>Last pass</TableCell>
                  <TableCell>Change role</TableCell>
                  <TableCell>Delete</TableCell>
                  <TableCell>Analytic</TableCell>
                </>}
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
                {currentMember && (currentMember.action === 'owner' || currentMember.action === 'admin') &&
                  <>
                    <TableCell>
                      {lastPass?.filter(el => el.user_id === member.user_id)
                        .map(el => el.quizzes)
                        .flat()
                        .map(q => new Date(q.last_quiz_pass_at))
                        .sort((a, b) => b.getTime() - a.getTime())
                        .map((d, index) => (
                          index === 0 && (
                            <div key={d.getTime()}>
                              <div>{`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`}</div>
                              <div>{d.toLocaleTimeString()}</div>
                            </div>
                          )
                        ))}
                    </TableCell>
                    <TableCell>
                      {(user.user_id !== member.user_id && member.action !== 'owner') && (
                        <Switch
                          {...label}
                          checked={member.action === 'admin'}
                          color="secondary"
                          onChange={(e) => handleChangeSwitch(e, member.action_id)}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {user.user_id !== member.user_id && member.action !== 'owner' && (
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
                    <TableCell>
                      <IconButton>
                        <FaChartBar onClick={() => handleChart(member.user_id)} />
                      </IconButton>
                    </TableCell>
                  </>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableCompanyMember;