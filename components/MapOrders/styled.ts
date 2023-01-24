import styled from "styled-components";

export const MapOrdersContainer = styled.div`
  display: flex;
`;

export const InfoWindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InfoWindowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 18px;
`;

export const InfoWindoOrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InfoWindoOrderItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InfoWindowRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export const InfoWindowLabel = styled.span`
  min-width: 100px;
  font-weight: 500;
`;

export const InfoWindowValue = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const InfoWindowOrderTotal = styled.span`
  font-weight: 500;
  font-size: 24px;
  color: green;
`;
