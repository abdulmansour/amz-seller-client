import { LoadingSpinner } from '@components/LoadingSpinner';
import AuthenticatedPage from '@layout/AuthenticatedPage';
import { ErrorMessage } from '@layout/Global/styled';
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
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getOrder = async () => {
      await fetch(`/api/sp-api?orderId=${orderId}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error(
            `${orderId} is not valid. Please check your orderId and try again.`
          );
        })
        .then((orderPayload) => setOrder(orderPayload))
        .catch((e: Error) => {
          setError(e.message);
        });
    };
    if (orderId) getOrder();
  }, [orderId]);

  return (
    <AuthenticatedPage>
      <Typography sx={{ fontSize: 36 }}>{orderId}</Typography>
      {order && <DynamicReactJson src={order} />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!order && !error && <LoadingSpinner loading={1} />}
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
