import React from 'react';
import { Company } from 'Types/Company';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { Box, Grid } from '@mui/material';


const CompanyCard: React.FC<{ data: Company }> = ({ data }) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} margin={3}>
      <Card>
        <Box mb={2} margin={2}>
          <Avatar sx={{ width: 64, height: 64 }} alt={data.company_name} src={data.company_avatar} />
        </Box>
        <CardContent>
          <Typography variant="h6">
            {data.company_name}
          </Typography>
          <Typography variant="body1">
            {data.company_title}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CompanyCard;