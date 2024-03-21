import React from 'react';
import './PhoneInput.css';
import ReactPhoneInput from 'react-phone-input-2';
import { ErrorMessage, useFormikContext } from 'formik';
import 'react-phone-input-2/lib/material.css';

const PhoneInput: React.FC<{
  value: string,
  error: string | undefined
}> = ({
        value,
        error,
      }) => {
  const { setFieldValue } = useFormikContext();
  return (
    <>
      <ReactPhoneInput
        inputProps={{
          name: 'user_phone',
          id: 'user-phone',
          autoFocus: true,
          error: !!error,
          style: { height: '60px', width: '100%'},
        }}
        country="ua"
        disableSearchIcon
        enableSearch
        value={value}
        onChange={(value: string) => setFieldValue('user_phone', value)}
      />
      <ErrorMessage name="user_phone" component="p" />
    </>
  );
};

export default PhoneInput;