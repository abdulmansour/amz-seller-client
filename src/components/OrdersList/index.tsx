import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CustomOrder } from '../../pages';
import SearchBar from '../SearchBar';
import {
  OrderItemContainer,
  OrderItemHeader,
  OrderItemHeaderContainer,
  OrderItemSubHeader,
  OrderItemValue,
  OrdersItemsContainer,
  OrdersListContainer,
  OrdersListEmptyMessage,
  OrdersListHeader,
} from './styled';

export interface OrdersListProps {
  orders?: CustomOrder[];
  selectedOrder?: CustomOrder;
  handleMouseOver?: (order: CustomOrder) => void;
  handleOnClick?: (order: CustomOrder) => void;
}

function formatDateLongWithTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  };
  return date.toLocaleDateString('en-US', options);
}

const sortOrders = (orders: CustomOrder[]) => {
  return orders?.sort((a, b) => {
    return (
      b.OrderStatus.localeCompare(a.OrderStatus) ||
      new Date(b.PurchaseDate).getTime() - new Date(a.PurchaseDate).getTime()
    );
  });
};

export const OrdersList = ({
  orders,
  selectedOrder,
  handleMouseOver,
  handleOnClick,
}: OrdersListProps) => {
  const refs: Record<string, React.RefObject<HTMLDivElement>> = {};
  const [filteredOrders, setFilteredOrders] = useState(orders);
  useEffect(() => {
    if (selectedOrder) {
      const ref = refs[selectedOrder.AmazonOrderId];
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedOrder]);

  const handleOrdersSearch = (searchTerm: string) => {
    const _filteredOrders = orders?.filter((order) => {
      return order.AmazonOrderId.includes(searchTerm);
    });
    setFilteredOrders(_filteredOrders);
  };

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  return (
    <OrdersListContainer>
      <OrdersListHeader>Orders ({orders?.length})</OrdersListHeader>
      <SearchBar handleSearch={handleOrdersSearch} />
      {filteredOrders?.length ? (
        <OrdersItemsContainer>
          {sortOrders(filteredOrders)?.map((order) => {
            const ref = React.createRef<HTMLDivElement>();
            refs[order.AmazonOrderId] = ref;

            return (
              <OrderItemContainer
                elevation={3}
                key={order.AmazonOrderId}
                onMouseOver={() => handleMouseOver?.(order)}
                onClick={() => {
                  handleOnClick?.(order);
                }}
                isselected={
                  order.AmazonOrderId === selectedOrder?.AmazonOrderId ? 1 : 0
                }
                status={order.OrderStatus}
                ref={ref}
              >
                <OrderItemHeaderContainer>
                  <OrderItemHeader>
                    <Link href={`/orders/${order.AmazonOrderId}`}>
                      {order.AmazonOrderId}
                    </Link>
                  </OrderItemHeader>
                  <OrderItemSubHeader>
                    {formatDateLongWithTime(new Date(order.PurchaseDate))}
                  </OrderItemSubHeader>
                </OrderItemHeaderContainer>

                <OrderItemValue>{order.OrderStatus}</OrderItemValue>
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
