import { Currency, ForexRates } from '@components/SalesCard';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const base = req?.query?.base as string;
  const symbols = req?.query?.symbols as string;

  await fetch(
    `https://api.apilayer.com/fixer/latest?base=${base}&symbols=${symbols}`,
    {
      headers: { apikey: process.env.FIXER_API_KEY as string },
    }
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
    })
    .catch(() => {
      res.send({});
    });
};

export default handler;
