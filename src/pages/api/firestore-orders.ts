import admin from 'firebase-admin';
import { cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { DocumentData, getFirestore } from 'firebase-admin/firestore';
import { NextApiRequest, NextApiResponse } from 'next';
import serviceAccount from 'utils/service_account_firestore.json';
import { CustomOrder } from '..';

const setToSunday = (date: Date) => {
  const day = date.getDay() || 7;
  if (day !== 0) date.setHours(-24 * day);
  return date;
};

const goBack21Days = (date: Date) => {
  const startDate = new Date(date.getTime() - 21 * 24 * 60 * 60 * 1000);
  startDate.setUTCHours(0, 0, 0, 0);
  return startDate;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (admin.apps.length === 0)
    initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
      databaseURL: 'https://molgha.firebaseio.com',
    });

  const db = getFirestore();

  const fromDate = goBack21Days(setToSunday(new Date())).toLocaleString();

  const snapshot = await db
    .collection('orders')
    .where('PurchaseDate', '>', new Date(fromDate))
    .get();

  const orders: Record<string, CustomOrder> = {};

  snapshot.forEach((doc: DocumentData) => {
    const id: string = doc.id;
    const order = doc.data();

    order.ShippingAddressGeoLocation = {
      ...order.ShippingAddressGeoLocation,
      latitude: order.ShippingAddressGeoLocation?.latitude,
      longitude: order.ShippingAddressGeoLocation?.longitude,
    };

    order.EarliestShipDate = new Date(order.EarliestShipDate._seconds * 1000);
    order.LastUpdateDate = new Date(order.LastUpdateDate._seconds * 1000);
    order.LatestShipDate = new Date(order.LatestShipDate._seconds * 1000);
    order.PurchaseDate = new Date(order.PurchaseDate._seconds * 1000);

    orders[id] = order;
  });

  res.send(orders);
};

export default handler;