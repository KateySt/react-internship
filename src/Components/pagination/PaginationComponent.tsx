import React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';

const PaginationComponent: React.FC<{
  data: any[],
  pagination: { total_page: number },
  nextPage: (event: React.ChangeEvent<unknown>, value: number) => void,
  url: string,
  RenderComponent: React.ComponentType<any>,
  idKey: string,
}> = ({
        data,
        pagination,
        nextPage,
        url,
        RenderComponent,
        idKey,
      }) => {
  return (
    <Grid margin={3}>
      {data && data.length > 0 ?
        <Grid>
          {data.map((el, index) => (
            <Link to={`${url}/${el[idKey]}`} key={index}>
              <RenderComponent data={el} />
            </Link>
          ))}
          <Stack spacing={2} alignItems="center">
            <Pagination
              count={pagination?.total_page}
              color="secondary"
              onChange={nextPage} />
          </Stack>
        </Grid>
        :
        <Box textAlign="center" justifyContent="center">
          <Typography variant="h6" color="textSecondary">
            Don't have any object
          </Typography>
        </Box>
      }
    </Grid>
  );
};

export default PaginationComponent;