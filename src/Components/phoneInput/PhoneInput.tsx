import React from 'react';
import './PhoneInput.css';
import ReactPhoneInput from 'react-phone-input-2';
import { ErrorMessage, useFormikContext } from 'formik';
import 'react-phone-input-2/lib/material.css';

const PhoneInput: React.FC<{
  value: string,
  error: string | undefined
  name: string,
}> = ({
        value,
        error,
        name,
      }) => {
  const { setFieldValue } = useFormikContext();
  return (
    <>
      <ReactPhoneInput
        inputProps={{
          name: name,
          id: name,
          autoFocus: true,
          error: !!error,
          style: { height: '60px', width: '100%' },
        }}
        country="ua"
        disableSearchIcon
        enableSearch
        value={value}
        onChange={(value: string) => setFieldValue(name, value)}
      />
      <ErrorMessage name={name} component="p" />
    </>
  );
};

export default PhoneInput;