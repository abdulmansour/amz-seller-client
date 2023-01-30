import { Box, Paper, Theme, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { Order, OrderOrderStatusEnum } from "@sp-api-sdk/orders-api-v0";

export const OrdersListContainer = styled(Paper)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 16px;
  justify-content: start;
  align-items: center;
  min-width: 20vw;
  height: 60vh;
  padding: 15px;
`;

export const OrdersListHeader = styled(Typography)``;

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
  if (status === "Shipped") return theme.orderStatus?.shipped;
  if (status === "Pending") return theme.orderStatus?.pending;
  if (status === "Canceled") return theme.orderStatus?.canceled;
  return "";
};

export const OrderItemContainer = styled(Paper)<OrderItemContainerProps>(
  ({ isselected, status, theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: "5px",
    margin: "5px",
    backgroundColor: getBackgroundColor(isselected, status, theme),
    filter: isselected ? "brightness(85%)" : "",
    ":hover": {
      cursor: "pointer",
    },
  })
);

export const OrderItemHeaderContainer = styled(Box)``;

export const OrderItemHeader = styled(Typography)``;
export const OrderItemSubHeader = styled(Typography)(({ theme }) => ({
  fontSize: "12px",
  color: theme.palette.grey[600],
}));

export const OrderItemValue = styled(Typography)``;

export const OrdersListEmptyMessage = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
`;