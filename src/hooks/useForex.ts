import { Currency } from '@components/SalesCard';
import { useEffect, useState } from 'react';

export const useForex = (
  baseRateCurrency: Currency,
  currencies: Currency[]
) => {
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

  return { rates };
};
