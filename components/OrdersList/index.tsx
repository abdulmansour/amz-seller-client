import React from "react";
import { useEffect, useRef } from "react";
import { CustomOrder } from "../../pages";
import {
  OrderItemContainer,
  OrderItemHeader,
  OrderItemHeaderContainer,
  OrderItemSubHeader,
  OrdersItemsContainer,
  OrdersListContainer,
  OrdersListEmptyMessage,
  OrdersListHeader,
} from "./styled";

export interface OrdersListProps {
  orders: CustomOrder[] | undefined;
  selectedOrder: CustomOrder | undefined;
  handleMouseOver: (order: CustomOrder) => void;
  handleOnClick: (order: CustomOrder) => void;
}

export const OrdersList = ({
  orders,
  selectedOrder,
  handleMouseOver,
  handleOnClick,
}: OrdersListProps) => {
  const refs: Record<string, React.RefObject<HTMLDivElement>> = {};
  useEffect(() => {
    if (selectedOrder) {
      const ref = refs[selectedOrder.AmazonOrderId];
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedOrder]);

  return (
    <OrdersListContainer>
      <OrdersListHeader>Orders ({orders?.length})</OrdersListHeader>
      {orders?.length ? (
        <OrdersItemsContainer>
          {orders
            ?.sort((a, b) => {
              return (
                new Date(b.PurchaseDate).getTime() -
                new Date(a.PurchaseDate).getTime()
              );
            })
            ?.map((order) => {
              const ref = React.createRef<HTMLDivElement>();
              refs[order.AmazonOrderId] = ref;

              return (
                <OrderItemContainer
                  key={order.AmazonOrderId}
                  onMouseOver={() => handleMouseOver(order)}
                  onClick={() => {
                    handleOnClick(order);
                  }}
                  isSelected={
                    order.AmazonOrderId === selectedOrder?.AmazonOrderId
                  }
                  ref={ref}
                >
                  <OrderItemHeaderContainer>
                    <OrderItemHeader>{order.AmazonOrderId}</OrderItemHeader>
                    <OrderItemSubHeader>
                      {new Date(order.PurchaseDate).toLocaleString()}
                    </OrderItemSubHeader>
                  </OrderItemHeaderContainer>

                  <div>{order.OrderStatus}</div>
                </OrderItemContainer>
              );
            })}
        </OrdersItemsContainer>
      ) : (
        <OrdersListEmptyMessage>
          No orders to display based on your filters
        </OrdersListEmptyMessage>
      )}
    </OrdersListContainer>
  );
};
