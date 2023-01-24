import { useEffect, useState } from "react";
import { CustomOrder } from "../pages";

export interface UseOrderProps {
  startDate?: Date | null;
  endDate?: Date | null;
}

export enum CeilTo {
  HOUR,
  DAY,
  WEEK,
}

const getExpiryDate = (ceilTo: CeilTo) => {
  if (ceilTo === CeilTo.HOUR) return ceilToHour(new Date());
  if (ceilTo === CeilTo.DAY) return ceilToDay(new Date());
  if (ceilTo === CeilTo.WEEK) return ceilToWeek(new Date());
  return ceilToHour(new Date());
};

const ceilToHour = (date: Date) => {
  const m = date.getMinutes();
  const s = date.getSeconds();
  const secondsUntilEndOfHour = 60 * 60 - 60 * m - s;
  return new Date(date.getTime() + secondsUntilEndOfHour * 1000);
};

const ceilToDay = (date: Date) => {
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  const secondsUntilEndOfDay = 60 * 60 * 24 - 60 * 60 * h - 60 * m - s;
  return new Date(date.getTime() + secondsUntilEndOfDay * 1000);
};

const ceilToWeek = (date: Date) => {
  const d = date.getDay();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  const secondsUntilEndofWeek =
    60 * 60 * 24 * 7 - 60 * 60 * 24 * d - 60 * 60 * h - 60 * m - s;
  return new Date(date.getTime() + secondsUntilEndofWeek * 1000);
};

export const useOrders = ({ startDate, endDate }: UseOrderProps) => {
  const [orders, setOrders] = useState<CustomOrder[]>();

  const fetchOrders = async (
    startDate: Date | null | undefined,
    endDate: Date | null | undefined
  ) => {
    const orders1000d: Record<string, CustomOrder> = await fetch(
      "/api/gcs-json-gz?fileName=orders_1000d.json.gz"
    ).then((res) => res.json());

    const orders21d: Record<string, CustomOrder> = await fetch(
      "/api/gcs-json-gz?fileName=orders_21d.json.gz"
    ).then((res) => res.json());

    // const orders21d: Record<string, CustomOrder> = await fetch(
    //   `/api/firestore-orders`
    // ).then((res) => res.json());

    const ordersObj: Record<string, CustomOrder> = {
      ...orders1000d,
      ...orders21d,
    };

    if (startDate && endDate && ordersObj) {
      const filteredOrders: CustomOrder[] = Object.keys(ordersObj).reduce(
        (acc, orderId) => {
          const order = ordersObj[orderId];
          if (order?.PurchaseDate) {
            const purchaseDate = new Date(order.PurchaseDate);
            if (purchaseDate >= startDate && purchaseDate <= endDate)
              acc.push(order);
          }
          return acc;
        },
        [] as CustomOrder[]
      );

      setOrders(filteredOrders);
    }
  };

  const invalidateCache = async (
    localStorageKey: string,
    ceilTo: CeilTo,
    cacheName: string,
    cacheRequest: string
  ) => {
    const expiryDate = localStorage.getItem(localStorageKey);
    const isExpired = expiryDate ? new Date(expiryDate) < new Date() : false;
    if (isExpired) {
      const cache = await caches.open(cacheName);
      await cache.delete(cacheRequest);
    }

    if (!expiryDate || isExpired) {
      localStorage.setItem(
        localStorageKey,
        getExpiryDate(ceilTo).toLocaleString()
      );
    }
  };

  useEffect(() => {
    const getOrders = async () => {
      await invalidateCache(
        "orders1000dExpiry",
        CeilTo.WEEK,
        "gcs-json-gz",
        "/api/gcs-json-gz?fileName=orders_1000d.json.gz"
      );
      await invalidateCache(
        "orders21dExpiry",
        CeilTo.HOUR,
        "gcs-json-gz",
        "/api/gcs-json-gz?fileName=orders_21d.json.gz"
      );
      // await invalidateCache(
      //   "orders21dExpiry",
      //   CeilTo.HOUR,
      //   "firestore-orders",
      //   "/api/firestore-orders"
      // );
      await fetchOrders(startDate, endDate);
    };

    getOrders();
  }, [startDate, endDate]);

  return {
    orders: orders,
  };
};
