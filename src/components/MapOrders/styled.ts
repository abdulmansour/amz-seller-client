import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const OrdersContainer = styled(Box)`
  display: flex;
`;
export const MapOrdersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  height: '535px',
}));

export const InfoWindowContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InfoWindowHeader = styled(Typography)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 18px;
`;

export const InfoWindoOrderItems = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InfoWindoOrderItem = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export const InfoWindowRow = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export const InfoWindowLabel = styled(Typography)`
  min-width: 100px;
  font-weight: 500;
  font-size: 12px;
`;

export const InfoWindowValue = styled(Typography)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
`;

export const InfoWindowOrderTotal = styled(Typography)`
  font-weight: 500;
  font-size: 24px;
  color: green;
`;
