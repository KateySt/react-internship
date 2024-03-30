import React from 'react';
import Modal from '../modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Grid, MenuItem } from '@mui/material';
import StyleButton from '../button/StyleButton';
import Typography from '@mui/material/Typography';
import { UserInfo } from 'Types/UserInfo';
import { Company } from 'Types/Company';

interface SendInviteProps {
  handleCloseModal: () => void;
  label: string;
  isShow: boolean;
  id: number;
  handleChange: (event: SelectChangeEvent) => void;
  data: (UserInfo | Company)[];
  handleSendRequest: () => void;
}

const SendRequest: React.FC<SendInviteProps> = ({
                                                  handleCloseModal,
                                                  label,
                                                  isShow,
                                                  id,
                                                  handleChange,
                                                  data,
                                                  handleSendRequest,
                                                }) => {
  return (
    <>
      <Modal isOpen={isShow} onClose={handleCloseModal}>
        <Typography variant="h5">Send invite to:</Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={id.toString()}
            label={label}
            onChange={handleChange}
          >
            {data &&
              data.map((el: any, index: number) => (
                <MenuItem key={index} value={el.user_id ? el.user_id : el.company_id}>
                  {el.user_firstname ? el.user_firstname : el.company_name}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <StyleButton text={'Send'} type={'submit'} onClick={handleSendRequest} />
          </Grid>
          <Grid item xs={6}>
            <StyleButton onClick={handleCloseModal} text={'Close'} />
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default SendRequest;