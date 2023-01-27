import styled from "styled-components";

export const OrdersListContainer = styled.div`
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

export const OrdersListHeader = styled.div``;

export const OrdersItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  gap: 5px;
`;

export interface OrderItemContainerProps {
  isSelected: boolean;
}

export const OrderItemContainer = styled.div<OrderItemContainerProps>`
  display: flex;
  flex-direction: column;
  padding: 5px;
  border-radius: 8px;
  border: 1px solid #e4e7eb;
  gap: 5px;
  box-shadow: 2px 2px 3px 2px #ebebeb;
  background-color: ${({ isSelected }) => (isSelected ? "#e4e7eb" : "")};

  :hover {
    background-color: #e4e7eb;
    cursor: pointer;
  }
`;

export const OrderItemHeaderContainer = styled.div``;

export const OrderItemHeader = styled.div``;
export const OrderItemSubHeader = styled.div`
  font-size: 12px;
  color: #797c80;
`;

export const OrdersListEmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
