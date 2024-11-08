import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { getListUsersAsync, selectUsers } from 'Store/features/user/UsersSlice';
import PaginationComponent from 'Components/pagination/PaginationComponent';
import UserCard from 'Components/cartUser/UserCard';

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
    <PaginationComponent
      data={users.users}
      pagination={users.pagination}
      nextPage={handleChange}
      url={'/users/user'}
      RenderComponent={UserCard}
      idKey={'user_id'} />
  );
};
export default UsersPage;