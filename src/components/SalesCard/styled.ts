import { Box, Paper, styled, Typography } from '@mui/material';

export const SalesCardContainer = styled(Paper)(({}) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '10px',
  gap: '15px',
  width: '100%',
}));

export const SalesCardHeader = styled(Typography)(({ theme }) => ({
  padding: '8px',
  fontSize: '16px',
  fontWeight: 700,
  color: 'white',
  backgroundColor: theme.palette.primary.main,
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'start',
}));

export const SalesCardItemHeader = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '5px',
}));

export const SalesCardItemHeaderLabel = styled(Typography)(({}) => ({
  fontWeight: 600,
}));

export const SalesCardItemContainer = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const CurrencyValue = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.customPalette.money.main,
}));
