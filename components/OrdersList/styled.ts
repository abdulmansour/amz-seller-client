import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const OrdersListContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 16px;
  justify-content: start;
  align-items: center;
  width: 20vw;
  height: 60vh;
  padding: 5px;
`;

export const OrdersListHeader = styled(Box)``;

export const OrdersItemsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  gap: 5px;
`;

export interface OrderItemContainerProps {
  isselected: number;
}

export const OrderItemContainer = styled(Box)<OrderItemContainerProps>(
  ({ isselected }) => ({
    display: "flex",
    flexDirection: "column",
    padding: "5px",
    borderRadius: "8px",
    border: "1px solid #e4e7eb",
    gap: "5px",
    boxShadow: "2px 2px 3px 2px #ebebeb",
    backgroundColor: isselected ? "#e4e7eb" : "",
  })
);

export const OrderItemHeaderContainer = styled(Box)``;

export const OrderItemHeader = styled(Box)``;
export const OrderItemSubHeader = styled(Box)`
  font-size: 12px;
  color: #797c80;
`;

export const OrdersListEmptyMessage = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
