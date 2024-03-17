import React from 'react';
import { Button } from '@mui/material';

type ButtonType = 'button' | 'submit' | 'reset' | undefined;
const StyleButton: React.FC<{ text: string, type?: ButtonType, onClick?: () => void, disabled?: boolean }> =
  ({ text, type = 'button', onClick, disabled = false }) => {
    return (
      <Button color="secondary" variant="contained" fullWidth type={type} onClick={onClick} disabled={disabled}>
        {text}
      </Button>
    );
  };

export default StyleButton;