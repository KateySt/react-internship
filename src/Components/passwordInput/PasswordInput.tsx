import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ErrorMessage, Field } from 'formik';
import { FormControl, InputLabel } from '@mui/material';

const PasswordInput: React.FC<{
  name: string,
  value: string,
  onChange: (e: React.ChangeEvent<any>) => void,
  error: boolean | undefined
}> =
  ({ name, value, onChange, error }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const formatName = (name: string) => {
      let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      formattedName = formattedName.replace(/_/g, ' ');
      return formattedName;
    };
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    return (
      <FormControl variant="outlined" fullWidth margin="normal">
        <InputLabel htmlFor="outlined-adornment-password">{formatName(name)}</InputLabel>
        <Field
          error={error}
          as={OutlinedInput}
          value={value}
          onChange={onChange}
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          name={name}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label={formatName(name)}
        />
        <ErrorMessage name={name} component="p" />
      </FormControl>
    );
  };

export default PasswordInput;