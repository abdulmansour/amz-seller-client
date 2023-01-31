import { GetStaticPaths, GetStaticProps } from 'next';

export interface OrderPageProps {
  orderId: string | undefined;
}

const OrderPage = ({ orderId }: OrderPageProps) => {
  return <>{orderId && <h1>{orderId}</h1>}</>;
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
