import React from 'react';
import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { UserInvited } from 'Types/UserInvited';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import { User } from 'Types/User';
import IconButton from '@mui/material/IconButton';

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
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User First Name</TableCell>
              <TableCell>User Last Name</TableCell>
              <TableCell>Role</TableCell>
              {currentMember && (currentMember.action === 'owner' || currentMember.action === 'admin') &&
                <>
                  <TableCell>Change role</TableCell>
                  <TableCell>Delete</TableCell>
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