import { LoadingSpinner } from '@components/LoadingSpinner';
import AuthenticatedPage from '@layout/AuthenticatedPage';
import { Typography } from '@mui/material';
import { CustomOrder } from '@pages/index';
import { GetStaticPaths, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });

export interface OrderPageProps {
  orderId: string | undefined;
}

const OrderPage = ({ orderId }: OrderPageProps) => {
  const [order, setOrder] = useState<CustomOrder | undefined>(undefined);
  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    const getOrder = async () => {
      const order = await fetch(`/api/sp-api?orderId=${orderId}`).then(
        (res) => {
          return res.json();
        }
      );

      setOrder(order);
    };
    if (orderId) getOrder();
  }, [orderId]);

  return (
    <AuthenticatedPage>
      {order && isBrowser && (
        <div>
          <Typography sx={{ fontSize: 36 }}>{order.AmazonOrderId}</Typography>
          <DynamicReactJson src={order} />
        </div>
      )}
      {!order && <LoadingSpinner loading={1} />}
    </AuthenticatedPage>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const orderId = params?.param?.[0];

  return {
    props: { orderId },
  };
};

export default OrderPage;
