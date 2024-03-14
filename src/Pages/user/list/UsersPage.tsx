import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { getListUsersAsync, selectUsers } from 'Store/features/user/UsersSlice';
import { Grid, Pagination, Stack } from '@mui/material';
import UserCard from '../../../Components/cart/UserCard';

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const [param, setParam] = useState<object>({ page: 1, page_size: 10 });

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setParam(prev => ({
      ...prev,
      page: value,
    }));
  };

  useEffect(() => {
    dispatch(getListUsersAsync(param));
  }, [param]);

  return (
    <>
      {(users.pagination && users.users) &&
        <>
          <Grid container spacing={2}>
            {users.users.map(user => (
              <UserCard key={user.user_id} user={user} />
            ))}
          </Grid>
          <Stack spacing={2}>
            <Pagination count={users.pagination.total_page} color="secondary" onChange={handleChange} />
          </Stack>
        </>}
    </>
  );
};

export default UsersPage;