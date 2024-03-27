import React from 'react';
import Modal from '../modal';
import { Grid, Typography } from '@mui/material';
import { TbHttpDelete } from 'react-icons/tb';
import StyleButton from '../button/StyleButton';
import { AiOutlineCheck } from 'react-icons/ai';

interface ActionProps {
  isShow: boolean;
  handleClose: () => void;
  data: any[];
  handleDeclineAction: (id: number) => void;
  handleAcceptAction?: (id: number) => void;
}

const Action: React.FC<ActionProps> = ({ isShow, handleClose, data, handleDeclineAction, handleAcceptAction }) => {
  return (
    <Modal isOpen={isShow} onClose={handleClose}>
      <Typography variant="h5">List</Typography>
      {data.length !== 0 ? (
        data.map((el: any, index: number) => (
          <Grid container key={index}
                alignItems="center"
                justifyContent="space-between"
                sx={{ margin: '4px' }}>
            <Typography variant="body1">{el.user_firstname ? el.user_firstname : el.company_name}</Typography>
            <>
              {handleAcceptAction && (
                <AiOutlineCheck size={28} onClick={() => handleAcceptAction(el.action_id)} />
              )}
              <TbHttpDelete size={28} onClick={() => handleDeclineAction(el.action_id)} />
            </>
          </Grid>
        ))
      ) : (
        <Typography variant="body1">Do not have anything</Typography>
      )}

      <StyleButton onClick={handleClose} text={'Close'} />
    </Modal>
  );
};

export default Action;