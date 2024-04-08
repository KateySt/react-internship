import React from 'react';
import {
  Avatar,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { User } from 'Types/User';
import 'react-phone-input-2/lib/material.css';
import StyleButton from '../button/StyleButton';
import { CompanyInvited } from 'Types/CompanyInvited';
import { useAppSelector } from 'Store/hooks';
import { selectRatingCompany } from 'Store/features/user/UsersSlice';

interface UserInfoProps {
  user: User;
  isEditable: boolean;
  onEditClick: () => void;
  companies: CompanyInvited[];
  handleLeaveCompany: (id: number) => void;
}

function truncateStringToScreenWidth(str: string) {
  const screenWidth = window.innerWidth;
  const charWidth = 10;
  const maxChars = Math.floor(screenWidth / charWidth);
  return str.slice(0, maxChars) + '...';
}

const UserInfo: React.FC<UserInfoProps> = ({ user, isEditable, onEditClick, companies, handleLeaveCompany }) => {
  const rating = useAppSelector(selectRatingCompany);
  return (
    <>
      {!!user.user_avatar ? (
        <Avatar alt={user.user_firstname} src={user.user_avatar}
                sx={{ width: 120, height: 120, margin: 'auto' }} />
      ) : (
        <Avatar sx={{ width: 120, height: 120, margin: 'auto' }} />
      )}
      <Typography variant="h5" gutterBottom>
        {`${user.user_firstname} ${user.user_lastname}`}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        e-mail: {user.user_email}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        city: {user.user_city}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        phone: {user.user_phone}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        status: {user.user_status}
      </Typography>
      {isEditable && <Rating
        name="read-only"
        value={rating * 0.05}
        readOnly
      />}
      <Typography variant="body1" color="textSecondary">
        links:
        <List>
          {user.user_links && user.user_links.map((link, index) => (
            <ListItem key={index}>
              <ListItemText>
                <Link href={link} underline="none">
                  {truncateStringToScreenWidth(link)}
                </Link>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Typography>
      {isEditable && companies.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Company Title</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company: CompanyInvited, index) => (
                <TableRow key={index}>
                  <TableCell>{company.company_name}</TableCell>
                  <TableCell>{company.company_title}</TableCell>
                  <TableCell>
                    {company.action !== 'owner' && (
                      <StyleButton text={'Leave'} onClick={() => handleLeaveCompany(company.action_id)} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {isEditable && <StyleButton text={'Edit'} onClick={onEditClick} />}
    </>
  );
};

export default UserInfo;
