import { CustomOrder } from '@pages/index';
import moment from 'moment';
import { useEffect, useState } from 'react';

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

const getFilenameByMoment = (time: moment.Moment, monthSub = 0) => {
  if (monthSub !== 0) time.subtract(monthSub, 'month');
  return `orders_${time.format('YYYY-MM')}.json.gz`;
};

const getFiles = (sDate: moment.Moment, eDate: moment.Moment) => {
  const result = [];

  if (eDate.isAfter(moment())) {
    eDate = moment();
  }

  while (true) {
    if (sDate.isBefore(eDate)) {
      result.push(getFilenameByMoment(sDate));
      sDate.add(1, 'month');
    }

    if (sDate.isAfter(eDate)) {
      if (sDate.month() === eDate.month()) {
        if (!result.some((r) => r === getFilenameByMoment(sDate)))
          result.push(getFilenameByMoment(sDate));
      }
      break;
    }
  }

  return result;
};

export const getOrdersByDateRange = async (
  startDate: Date | undefined | null,
  endDate: Date | undefined | null
) => {
  let orders = {};

  if (startDate && endDate) {
    const files = getFiles(moment(startDate), moment(endDate));

    await Promise.all(
      files.map((file) => fetch(`/api/gcs-json-gz?fileName=${file}`))
    )
      .then((responses) => Promise.all(responses.map((res) => res.json())))
      .then((_ordersList: Record<string, CustomOrder>[]) => {
        _ordersList.forEach((_orders) => {
          orders = { ...orders, ..._orders };
        });
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
      });
  }

  return orders;
};

export const invalidateCache = async (
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

const invalidateCaches = async () => {
  await invalidateCache(
    getFilenameByMoment(moment()),
    CeilTo.HOUR,
    'gcs-json-gz',
    `/api/gcs-json-gz?fileName=${getFilenameByMoment(moment())}`
  );
  await invalidateCache(
    getFilenameByMoment(moment(), 1),
    CeilTo.HOUR,
    'gcs-json-gz',
    `/api/gcs-json-gz?fileName=${getFilenameByMoment(moment(), 1)}`
  );
};

export const useOrders = ({ startDate, endDate }: UseOrderProps) => {
  const [orders, setOrders] = useState<CustomOrder[]>();

  const fetchOrders = async (
    startDate: Date | null | undefined,
    endDate: Date | null | undefined
  ) => {
    const orders: Record<string, CustomOrder> = await getOrdersByDateRange(
      startDate,
      endDate
    );

    if (startDate && endDate && orders) {
      const mStartDate = moment(startDate);
      const mEndDate = moment(endDate);
      const filteredOrders: CustomOrder[] = Object.keys(orders).reduce(
        (acc, orderId) => {
          const order = orders[orderId];
          if (order?.PurchaseDate) {
            const purchaseDate = new Date(order.PurchaseDate);
            if (moment(purchaseDate).isBetween(mStartDate, mEndDate)) {
              acc.push(order);
            }
          }
          return acc;
        },
        [] as CustomOrder[]
      );

      return filteredOrders;
    }
  };

  useEffect(() => {
    const getOrders = async () => {
      await invalidateCaches();
      const filteredOrders = await fetchOrders(startDate, endDate);
      setOrders(filteredOrders);
    };

    getOrders();
  }, [startDate, endDate]);

  return {
    orders: orders,
  };
};
