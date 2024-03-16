import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { getListUsersAsync, selectUsers } from 'Store/features/user/UsersSlice';
import { Pagination, Stack } from '@mui/material';
import UserCard from 'Components/cart/UserCard';
import { Link } from 'react-router-dom';

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

          {users.users.map(user => (
            <Link to={`/users/profile/${user.user_id}`}>
              <UserCard key={user.user_id} user={user} />
            </Link>
          ))}
          <Stack spacing={2}>
            <Pagination count={users.pagination.total_page} color="secondary" onChange={handleChange} />
          </Stack>
        </>}
    </>
  );
};

export default UsersPage;