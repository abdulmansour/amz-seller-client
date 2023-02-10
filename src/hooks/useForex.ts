import { Currency } from '@components/SalesCard';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';

export const useForex = (
  baseRateCurrency: Currency,
  currencies: Currency[]
) => {
  const [rates, setRates] = useState<Record<Currency, number>>();
  const { user } = useContext(AuthContext);

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
    if (user) getRates();
  }, [user]);

  return { rates };
};
