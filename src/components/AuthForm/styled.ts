import { Box, Paper, styled, Typography } from '@mui/material';

export const AuthFormContainer = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
}));

export const AuthFormBody = styled(Paper)(({}) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: '10px',
  padding: '20px',
  justifyContent: 'center',
  alignItems: 'center',
  width: 'fit-content',
  height: 'fit-content',
}));

export const AuthFormErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
}));
