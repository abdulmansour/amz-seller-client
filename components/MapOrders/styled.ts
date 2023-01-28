import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const OrdersContainer = styled(Box)`
  display: flex;
`;

export const MapOrdersContainer = styled(Box)`
  display: flex;
  flex-direction: row;
`;

export const InfoWindowContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InfoWindowHeader = styled(Box)`
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

export const InfoWindowLabel = styled(Box)`
  min-width: 100px;
  font-weight: 500;
`;

export const InfoWindowValue = styled(Box)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const InfoWindowOrderTotal = styled(Box)`
  font-weight: 500;
  font-size: 24px;
  color: green;
`;
