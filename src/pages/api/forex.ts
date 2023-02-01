import { Currency, ForexRates } from '@components/SalesCard';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const base = req?.query?.base as string;
  const symbols = req?.query?.symbols as string;

  await fetch(
    `https://theforexapi.com/api/latest?base=${base}&symbols=${symbols}`
  )
    .then((res) => res.json())
    .then(({ base, rates }: ForexRates) => {
      const _rates = {
        [Currency.USD]: rates[Currency.USD],
        [Currency.CAD]: rates[Currency.CAD],
        [Currency.MXN]: rates[Currency.MXN],
        [base]: 1,
      };
      res.send(_rates);
    });
};

export default handler;
