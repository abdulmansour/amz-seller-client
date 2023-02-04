import { Box, styled } from '@mui/material';

export const SalesCardsContainer = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingInline: '10px',
  gap: '10px',
}));
