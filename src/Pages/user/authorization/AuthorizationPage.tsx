import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField } from '@mui/material';

const AuthorizationPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const handelValueChange = () => {
    axios.post('/auth/login/', {email,password}).then((data) => data.data)
      .then((el) => console.log(el))
      .catch((err) => console.log('Don`t correct input', err));
  };

  return (
    <div>
      <TextField id="outlined-required" label="email" variant="outlined" value={email}
                 onChange={e => setEmail(e.target.value)} />
      <TextField id="outlined-password-input" label="password" autoComplete="current-password" type="password"
                 value={password}
                 onChange={e => setPassword(e.target.value)} />
      <Button color="secondary" onClick={handelValueChange}>Secondary</Button>
    </div>
  );
};

export default AuthorizationPage;
