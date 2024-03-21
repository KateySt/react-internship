import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { cities } from 'Utils/cities';
import { AutocompleteValue } from '@mui/material';

interface CityAutocompleteProps {
  id: string;
  value: string;
  onChange: (newValue: AutocompleteValue<unknown, false, false, false>) => void;
  onBlur: (e: any) => void;
  error: boolean;
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
                                                             id,
                                                             value,
                                                             onChange,
                                                             onBlur,
                                                             error,
                                                           }) => (
  <Autocomplete
    id={id}
    options={cities}
    fullWidth
    value={value}
    onChange={(event, newValue) => onChange(newValue)}
    onBlur={onBlur}
    renderInput={(params) => (
      <TextField
        {...params}
        label="City"
        variant="outlined"
        margin="normal"
        error={error}
      />
    )}
  />
);

export default CityAutocomplete;
