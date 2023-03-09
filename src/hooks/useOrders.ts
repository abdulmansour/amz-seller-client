import { FilterOption } from '@components/FilterGroup';
import {
  CustomOrder,
  FilterLabels,
  martketplaceIdToCountry,
} from '@pages/index';
import { User } from 'firebase/auth';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import { AuthContext } from 'src/contexts/AuthContext';

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
  endDate: Date | undefined | null,
  user: User | undefined
) => {
  let orders = {};

  if (startDate && endDate) {
    const files = getFiles(moment(startDate), moment(endDate));
    await Promise.all(
      files.map((file) =>
        fetch(
          `/api/gcs-json-gz?isMobile=${isMobile}&fileName=${file}&bucketName=${
            user?.uid || ''
          }`
        )
      )
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

const invalidateCaches = async (user: User | undefined) => {
  await invalidateCache(
    getFilenameByMoment(moment()),
    CeilTo.HOUR,
    'gcs-json-gz',
    `/api/gcs-json-gz?isMobile=${isMobile}&fileName=${getFilenameByMoment(
      moment()
    )}&bucketName=${user?.uid || ''}`
  );
  await invalidateCache(
    getFilenameByMoment(moment(), 1),
    CeilTo.HOUR,
    'gcs-json-gz',
    `/api/gcs-json-gz?isMobile=${isMobile}&fileName=${getFilenameByMoment(
      moment(),
      1
    )}&bucketName=${user?.uid || ''}`
  );
};

export interface OrdersData {
  orders: CustomOrder[] | undefined;
  filters?: Record<FilterLabels, Record<string, FilterOption> | undefined>;
  loading: boolean;
}

export const useOrders = (dateRange: DateRange) => {
  const { user } = useContext(AuthContext);
  const [startDate, endDate] = [dateRange?.[0], dateRange?.[1]];

  const [data, setData] = useState<OrdersData>({
    orders: [],
    filters: undefined,
    loading: false,
  });

  const fetchOrders = async (
    startDate: Date | null | undefined,
    endDate: Date | null | undefined
  ) => {
    const orders: Record<string, CustomOrder> = await getOrdersByDateRange(
      startDate,
      endDate,
      user
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
      setData({ ...data, loading: true });
      await invalidateCaches(user);
      const filteredOrders = await fetchOrders(startDate, endDate);

      const _marketplaceMap: Record<string, FilterOption> = {};
      filteredOrders?.forEach((order) => {
        if (order.MarketplaceId) {
          if (!(order.MarketplaceId in _marketplaceMap)) {
            _marketplaceMap[order.MarketplaceId] = {
              label: martketplaceIdToCountry(order.MarketplaceId) || 'None',
              value: order.MarketplaceId,
              selected: false,
              count: 1,
            };
          } else {
            _marketplaceMap[order.MarketplaceId] = {
              ..._marketplaceMap[order.MarketplaceId],
              count: (_marketplaceMap[order.MarketplaceId].count as number) + 1,
            };
          }
        }
      });

      const _statusMap: Record<string, FilterOption> = {};
      filteredOrders?.forEach((order) => {
        if (order.OrderStatus) {
          if (!(order.OrderStatus in _statusMap)) {
            _statusMap[order.OrderStatus] = {
              label: order.OrderStatus,
              value: order.OrderStatus,
              selected: false,
              count: 1,
            };
          } else {
            _statusMap[order.OrderStatus] = {
              ..._statusMap[order.OrderStatus],
              count: (_statusMap[order.OrderStatus].count as number) + 1,
            };
          }
        }
      });

      const _skuMap: Record<string, FilterOption> = {};
      filteredOrders?.forEach((order) => {
        if (order.OrderItems) {
          order.OrderItems.forEach((item) => {
            if (item.SellerSKU) {
              if (!(item.SellerSKU in _skuMap)) {
                _skuMap[item.SellerSKU] = {
                  label: item.SellerSKU,
                  value: item.SellerSKU,
                  selected: false,
                  count: 1,
                };
              } else {
                _skuMap[item.SellerSKU] = {
                  ..._skuMap[item.SellerSKU],
                  count: (_skuMap[item.SellerSKU].count as number) + 1,
                };
              }
            }
          });
        }
      });

      const _filters = {
        [FilterLabels.MARKETPLACE]: _marketplaceMap,
        [FilterLabels.ORDER_STATUS]: _statusMap,
        [FilterLabels.SKU]: _skuMap,
      };

      setData({ orders: filteredOrders, filters: _filters, loading: false });
    };

    if (user) getOrders();
  }, [startDate, endDate, user]);

  return data;
};
