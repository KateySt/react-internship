import React from 'react';
import Modal from '../modal';
import { Grid, Typography } from '@mui/material';
import { TbHttpDelete } from 'react-icons/tb';
import StyleButton from '../button/StyleButton';

const DeclineAction: React.FC<any> = ({ isShow, handleClose, invitedUsers, handleDeclineAction }) => {
  return (
    <Modal isOpen={isShow} onClose={handleClose}>
      <Typography variant="h5">List of invites</Typography>
      {invitedUsers.length !== 0 ? (
        invitedUsers.map((el: any, index: number) => (
          <Grid container key={index}
                alignItems="center"
                justifyContent="space-between"
                sx={{ margin: '4px' }}>
            <Typography variant="body1">{el.user_firstname ? el.user_firstname : el.company_name}</Typography>
            <TbHttpDelete size={28} onClick={() => handleDeclineAction(el.action_id)} />
          </Grid>
        ))
      ) : (
        <Typography variant="body1">Do not have any invited</Typography>
      )}

      <StyleButton onClick={handleClose} text={'Close'} />
    </Modal>
  );
};

export default DeclineAction;