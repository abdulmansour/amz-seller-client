import { styled, Typography } from '@mui/material';

export const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
}));
