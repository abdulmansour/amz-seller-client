import { Box, styled } from '@mui/material';

export const SalesCardsContainer = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '20px',
  gap: '30px',
}));
