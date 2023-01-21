import { useEffect, useState } from "react";
import { CustomOrder } from "../pages";

export interface UseOrderProps {
  startDate?: Date | null;
  endDate?: Date | null;
}

var roundToHour = () => {
  var d = new Date();
  var m = d.getMinutes();
  var s = d.getSeconds();
  var secondsUntilEndOfHour = 60 * 60 - m * 60 - s;
  return new Date(d.getTime() + secondsUntilEndOfHour * 1000);
};

export const useOrders = ({ startDate, endDate }: UseOrderProps) => {
  const [orders, setOrders] = useState<CustomOrder[]>();

  const fetchOrders = () => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((ordersObj) => {
        debugger;
        if (startDate && endDate && ordersObj) {
          const _orders: CustomOrder[] = Object.keys(ordersObj).reduce(
            (acc, orderId) => {
              const order = ordersObj[orderId];
              const purchaseDate = new Date(order.PurchaseDate);
              if (purchaseDate >= startDate && purchaseDate <= endDate)
                acc.push(order);
              return acc;
            },
            [] as CustomOrder[]
          );
          debugger;
          setOrders(_orders);
        } else {
          setOrders(orders);
        }
      });
  };

  const addOrdersExpiry = () => {
    localStorage.setItem("api-order-expiry", roundToHour().toLocaleString());
    console.log(
      "@@ orders will expire:",
      localStorage.getItem("api-order-expiry")
    );
  };

  useEffect(() => {
    const cacheExpiryTime = localStorage.getItem("api-order-expiry");
    console.log("@@cacheExpiryTime", cacheExpiryTime);

    if (cacheExpiryTime) {
      const shouldExpireCache = new Date(cacheExpiryTime) < new Date();
      console.log("@@compare dates", new Date(cacheExpiryTime), new Date());
      console.log("@@shouldExpireCache", shouldExpireCache);
      if (shouldExpireCache) {
        caches.open("api-orders").then((cache: Cache) => {
          console.log("@@deleting api-orders cache", shouldExpireCache);
          cache
            .delete("/api/orders")
            .then(() => {
              fetchOrders();
            })
            .then(() => {
              addOrdersExpiry();
            });
        });
      } else {
        fetchOrders();
      }
    } else {
      fetchOrders();
      addOrdersExpiry();
    }
  }, [startDate, endDate]);

  return {
    orders: orders,
  };
};
