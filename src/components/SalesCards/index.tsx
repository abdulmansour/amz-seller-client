import SalesCard, {
  computeOrdersSales,
  computeOrdersUnits,
  Currency,
} from '@components/SalesCard';
import {
  faCube,
  faDolly,
  faMoneyCheckDollar,
} from '@fortawesome/free-solid-svg-icons';
import { UseOrderProps, useOrders } from '@hooks/orders';
import { useForex } from '@hooks/useForex';
import { CircularProgress } from '@mui/material';
import { CustomOrder } from '@pages/index';
import {
  formatDateLabel,
  last30daysRange,
  last7DaysRange,
  todayRange,
  yesterdayRange,
} from '@utils/dateRanges';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import { SalesCardsContainer } from './styled';

export interface SalesCardsProps {
  orders?: CustomOrder[];
  dateRange: DateRange | null;
  baseRateCurrency: Currency;
  targetCurrency: Currency;
}

export const SalesCards = ({
  orders,
  dateRange,
  baseRateCurrency,
  targetCurrency,
}: SalesCardsProps) => {
  const currencies = [Currency.CAD, Currency.MXN];
  const { rates } = useForex(baseRateCurrency, currencies);
  const { orders: todayOrders } = useOrders(todayRange as UseOrderProps);
  const { orders: yesterdayOrders } = useOrders(
    yesterdayRange as UseOrderProps
  );
  const { orders: last7DaysOrders } = useOrders(
    last7DaysRange as UseOrderProps
  );
  const { orders: last30DaysOrders } = useOrders(
    last30daysRange as UseOrderProps
  );

  return (
    <SalesCardsContainer>
      {rates &&
      orders &&
      todayOrders &&
      yesterdayOrders &&
      last7DaysOrders &&
      last30DaysOrders &&
      dateRange ? (
        <>
          {[
            {
              headerLabel: `${formatDateLabel(
                dateRange[0]
              )} - ${formatDateLabel(dateRange[1])}`,
              rangeOrders: orders,
            },
            { headerLabel: 'Today', rangeOrders: todayOrders },
            { headerLabel: 'Yesterday', rangeOrders: yesterdayOrders },
            { headerLabel: 'Last 7 Days', rangeOrders: last7DaysOrders },
            { headerLabel: 'Last 30 Days', rangeOrders: last30DaysOrders },
          ].map(({ headerLabel, rangeOrders }) => {
            return (
              <SalesCard
                key={headerLabel}
                headerLabel={headerLabel}
                salesCardItems={[
                  {
                    label: 'Sales',
                    targetCurrency: targetCurrency,
                    value: computeOrdersSales(
                      rangeOrders,
                      targetCurrency,
                      rates
                    ),
                    icon: faMoneyCheckDollar,
                  },
                  {
                    label: 'Orders',
                    value: rangeOrders.length,
                    icon: faDolly,
                  },
                  {
                    label: 'Units',
                    value: computeOrdersUnits(rangeOrders),
                    icon: faCube,
                  },
                ]}
              />
            );
          })}
        </>
      ) : (
        <CircularProgress />
      )}
    </SalesCardsContainer>
  );
};
