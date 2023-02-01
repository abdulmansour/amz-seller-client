import { CustomOrder } from '@pages/index';
import currency from 'currency.js';
import { useEffect, useState } from 'react';

export interface SalesCardProps {
  orders?: CustomOrder[];
  baseRateCurrency: Currency;
  targetCurrency: Currency;
  currencies: Currency[];
}

export interface ForexRates {
  date: string;
  base: Currency;
  rates: Record<Currency, number>;
}

export enum Currency {
  USD = 'USD',
  MXN = 'MXN',
  CAD = 'CAD',
}

export const computeOrdersSales = (
  orders: CustomOrder[] | undefined,
  targetCurrency: Currency,
  rates: Record<Currency, number>
) => {
  return orders?.reduce((a, order) => {
    if (order?.OrderTotal?.Amount && order?.OrderTotal?.CurrencyCode)
      return (
        a +
        (parseFloat(order?.OrderTotal?.Amount) * rates[targetCurrency]) /
          rates[order.OrderTotal.CurrencyCode as Currency]
      );
    return a;
  }, 0);
};

const SalesCard = ({
  orders,
  baseRateCurrency = Currency.USD,
  targetCurrency = Currency.USD,
  currencies = [Currency.CAD, Currency.MXN],
}: SalesCardProps) => {
  const [sales, setSales] = useState(0);
  const [rates, setRates] = useState<Record<Currency, number>>();

  useEffect(() => {
    const getRates = async () => {
      await fetch(
        `api/forex?base=${baseRateCurrency}&symbols=${currencies.join(',')}`
      )
        .then((res) => res.json())
        .then((_rates: Record<Currency, number>) => {
          setRates(_rates);
        });
    };
    getRates();
  }, []);

  useEffect(() => {
    if (orders && rates)
      setSales(computeOrdersSales(orders, targetCurrency, rates) as number);
  }, [orders, rates]);
  return <>{currency(sales).format()}</>;
};

export default SalesCard;
