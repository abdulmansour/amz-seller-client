import SellingPartnerAPI, { Operation, ReqParams } from 'amazon-sp-api';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const orderId = req?.query?.orderId as string;
  const sellingPartnerApi = new SellingPartnerAPI({
    region: 'na',
    refresh_token: process.env.AWS_REFRESH_TOKEN as string,
    credentials: {
      SELLING_PARTNER_APP_CLIENT_ID: process.env
        .SELLING_PARTNER_APP_CLIENT_ID as string,
      SELLING_PARTNER_APP_CLIENT_SECRET: process.env
        .SELLING_PARTNER_APP_CLIENT_SECRET as string,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
      AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE as string,
    },
  });

  const orderPayload = await sellingPartnerApi.callAPI({
    endpoint: 'orders',
    operation: 'getOrder',
    path: { orderId: orderId },
    options: {
      version: 'v0',
    },
  } as ReqParams<Operation>);

  const orderItemsPayload = await sellingPartnerApi.callAPI({
    operation: 'getOrderItems',
    path: { orderId: orderId },
  });

  const order = { ...orderPayload, ...orderItemsPayload };

  res.status(200).send(order);
};

export default handler;
