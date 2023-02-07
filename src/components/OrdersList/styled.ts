import { Box, Paper, Theme, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { OrderOrderStatusEnum } from '@sp-api-sdk/orders-api-v0';

export const OrdersListContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  fontSize: '16px',
  justifyContent: 'start',
  alignItems: 'center',
  overflow: 'auto',
  height: '100%',
  width: '300px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

export const FiltersContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  overflowY: 'auto',
  height: '100%',
  width: '300px',

  fontWeight: 500,
  color: theme.customPalette.money.main,
}));

export const OrdersListHeader = styled(Typography)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1px;
`;

export const OrdersItemsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  gap: 5px;
`;

export interface OrderItemContainerProps {
  isselected: number;
  status: OrderOrderStatusEnum;
}

const getBackgroundColor = (
  isSelected: number,
  status: OrderOrderStatusEnum,
  theme: Theme
) => {
  if (status === 'Shipped') return theme.orderStatus?.shipped;
  if (status === 'Pending') return theme.orderStatus?.pending;
  if (status === 'Canceled') return theme.orderStatus?.canceled;
  return '';
};

export const OrderItemContainer = styled(Paper)<OrderItemContainerProps>(
  ({ isselected, status, theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: '5px',
    margin: '5px',
    backgroundColor: getBackgroundColor(isselected, status, theme),
    filter: isselected ? 'brightness(85%)' : '',
    ':hover': {
      cursor: 'pointer',
    },
  })
);

export const OrderItemHeaderContainer = styled(Box)``;

export const OrderItemHeader = styled(Typography)``;
export const OrderItemSubHeader = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: theme.palette.grey[600],
}));

export const OrderItemValue = styled(Typography)``;

export const OrdersListEmptyMessage = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const OrderItemFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'end',
  fontSize: '12px',
  color: theme.palette.grey[600],
}));
