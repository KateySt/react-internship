import React from 'react';
import Modal from '../modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { UserInfo } from 'Types/UserInfo';
import { Grid, MenuItem } from '@mui/material';
import StyleButton from '../button/StyleButton';
import Typography from '@mui/material/Typography';

const SendInvite: React.FC<any> = ({ handleCloseModal, isShow, userId, handleChange, users, handleSendInvitation }) => {
  return (
    <>
      <Modal isOpen={isShow} onClose={handleCloseModal}>
        <Typography variant="h5">Send invite to user</Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="demo-simple-select-label">User</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={userId}
            label="User"
            onChange={handleChange}
          >
            {users &&
              users.map((user: UserInfo, index: string) => (
                <MenuItem key={index} value={user.user_id}>{user.user_firstname}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <StyleButton text={'Send'} type={'submit'} onClick={handleSendInvitation} />
          </Grid>
          <Grid item xs={6}>
            <StyleButton onClick={handleCloseModal} text={'Close'} />
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default SendInvite;