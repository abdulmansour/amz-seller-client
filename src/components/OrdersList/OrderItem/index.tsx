import {
  OrderItemContainer,
  OrderItemFooter,
  OrderItemHeader,
  OrderItemHeaderContainer,
  OrderItemSubHeader,
  OrderItemValue,
} from '@components/OrdersList/styled';
import ScrollIntoViewWrapper from '@components/ScrollIntoViewWrapper';
import { CustomOrder } from '@pages/index';
import { formatDateLongWithTime } from '@utils/dateRanges';
import Link from 'next/link';
import { createRef, memo, useEffect, useState } from 'react';

export interface OrderItemProps {
  order: CustomOrder;
  isSelectedOrder: boolean;
  handleMouseOver: ((order: CustomOrder) => void) | undefined;
  handleOnClick: ((order: CustomOrder) => void) | undefined;
}

const OrderItem = ({
  order,
  isSelectedOrder,
  handleMouseOver,
  handleOnClick,
}: OrderItemProps) => {
  const [ref, setRef] = useState<React.RefObject<HTMLDivElement> | undefined>();

  useEffect(() => {
    if (isSelectedOrder) {
      setRef(createRef<HTMLDivElement>());
    } else {
      setRef(undefined);
    }
  }, [isSelectedOrder]);

  return (
    <ScrollIntoViewWrapper selectedRef={ref}>
      <OrderItemContainer
        elevation={3}
        key={order.AmazonOrderId}
        onMouseOver={() => handleMouseOver?.(order)}
        onClick={() => {
          handleOnClick?.(order);
        }}
        isselected={isSelectedOrder ? 1 : 0}
        status={order.OrderStatus}
        ref={order.ref}
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
        <OrderItemFooter>
          {order.OrderItems?.map((item) => item.SellerSKU).join(',')}
        </OrderItemFooter>
      </OrderItemContainer>
    </ScrollIntoViewWrapper>
  );
};

export default memo(OrderItem);
