import OrderItem from '@components/OrdersList/OrderItem';
import { Typography } from '@mui/material';
import { CustomOrder } from '@pages/index';
import React, { memo, useEffect, useMemo, useState } from 'react';
import SearchBar from '../SearchBar';
import {
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

const sortOrders = (orders: CustomOrder[]) => {
  return orders?.sort((a, b) => {
    return (
      b.OrderStatus.localeCompare(a.OrderStatus) ||
      new Date(b.PurchaseDate).getTime() - new Date(a.PurchaseDate).getTime()
    );
  });
};

const OrdersList = ({
  orders,
  selectedOrder,
  handleMouseOver,
  handleOnClick,
}: OrdersListProps) => {
  const [filteredOrders, setFilteredOrders] = useState(orders);

  const handleOrdersSearch = (searchTerm: string) => {
    const _filteredOrders = orders?.filter((order) => {
      return order.AmazonOrderId.includes(searchTerm);
    });
    setFilteredOrders(_filteredOrders);
  };

  const sliceOrdersSize = 1000;

  const [memOrders, refs] = useMemo(() => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {};
    return [
      orders?.map((order) => {
        order.ref = React.createRef<HTMLDivElement>();
        refs[order.AmazonOrderId] = order.ref;
        return order;
      }),
      refs,
    ];
  }, [orders]);

  useEffect(() => {
    setFilteredOrders(memOrders);
  }, [memOrders]);

  useEffect(() => {
    if (selectedOrder) {
      refs[selectedOrder.AmazonOrderId]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedOrder]);

  return (
    <OrdersListContainer>
      <OrdersListHeader>
        Orders ({orders?.length})
        {filteredOrders && filteredOrders?.length > sliceOrdersSize && (
          <Typography sx={{ fontSize: 10, color: '#9d9d9d' }}>
            {`*List displaying latest ${sliceOrdersSize} orders`}
          </Typography>
        )}
      </OrdersListHeader>

      <SearchBar handleSearch={handleOrdersSearch} />
      {filteredOrders?.length ? (
        <OrdersItemsContainer>
          {sortOrders(filteredOrders)
            ?.slice(0, sliceOrdersSize)
            .map((order) => {
              return (
                <OrderItem
                  key={order.AmazonOrderId}
                  order={order}
                  isSelectedOrder={
                    order.AmazonOrderId === selectedOrder?.AmazonOrderId
                  }
                  handleMouseOver={handleMouseOver}
                  handleOnClick={handleOnClick}
                />
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

export default memo(OrdersList);
