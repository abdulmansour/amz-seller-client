import { FilterOption } from '@components/FilterGroup';
import {
  computeSkuStats,
  getSkusFromSkuFilters,
} from '@components/OrdersTable';
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
import { useOrders } from '@hooks/useOrders';
import { CircularProgress, useMediaQuery } from '@mui/material';
import { CustomOrder } from '@pages/index';
import {
  formatDateLabel,
  last30daysRange,
  last7DaysRange,
  todayRange,
  yesterdayRange,
} from '@utils/dateRanges';
import { memo } from 'react';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import { SalesCardsContainer } from './styled';

export interface SalesCardsProps {
  orders?: CustomOrder[];
  dateRange: DateRange | null;
  rates?: Record<Currency, number>;
  targetCurrency: Currency;
  skuFilters?: Record<string, FilterOption> | undefined;
}

const SalesCards = ({
  orders,
  dateRange,
  rates,
  targetCurrency,
  skuFilters,
}: SalesCardsProps) => {
  const { orders: todayOrders } = useOrders(todayRange);
  const { orders: yesterdayOrders } = useOrders(yesterdayRange);
  const { orders: last7DaysOrders } = useOrders(last7DaysRange);
  const { orders: last30DaysOrders } = useOrders(last30daysRange);

  const isMobile = useMediaQuery('(max-width:900px)');

  const salesCards = (isMobile: boolean) => {
    if (isMobile && dateRange)
      return [
        {
          key: 'custom_range',
          headerLabel: `${formatDateLabel(dateRange[0])} - ${formatDateLabel(
            dateRange[1]
          )}`,
          rangeOrders: orders,
        },
      ];
    else if (!isMobile && dateRange)
      return [
        {
          key: 'custom_range',
          headerLabel: `${formatDateLabel(dateRange[0])} - ${formatDateLabel(
            dateRange[1]
          )}`,
          rangeOrders: orders,
        },
        { headerLabel: 'Today', rangeOrders: todayOrders },
        { headerLabel: 'Yesterday', rangeOrders: yesterdayOrders },
        { headerLabel: 'Last 7 Days', rangeOrders: last7DaysOrders },
        { headerLabel: 'Last 30 Days', rangeOrders: last30DaysOrders },
      ];
  };

  return (
    <SalesCardsContainer>
      {orders && rates && dateRange ? (
        <>
          {salesCards(isMobile)?.map(({ key, headerLabel, rangeOrders }) => {
            if (key === 'custom_range') {
              const skus = getSkusFromSkuFilters(skuFilters);
              const skuStats = computeSkuStats(
                rangeOrders,
                rates,
                targetCurrency,
                skus
              );
              const [sales, units] = Object.values(skuStats).reduce(
                (a, skuStat) => {
                  a[0] += skuStat.sales;
                  a[1] += skuStat.units;
                  return a;
                },
                [0, 0]
              );

              return (
                <SalesCard
                  key={headerLabel}
                  headerLabel={headerLabel}
                  salesCardItems={[
                    {
                      label: 'Sales',
                      targetCurrency: targetCurrency,
                      value: sales,
                      icon: faMoneyCheckDollar,
                    },
                    {
                      label: 'Orders',
                      value: rangeOrders?.length || 0,
                      icon: faDolly,
                    },
                    {
                      label: 'Units',
                      value: units,
                      icon: faCube,
                    },
                  ]}
                />
              );
            } else {
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
                      value: rangeOrders?.length || 0,
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
            }
          })}
        </>
      ) : (
        <CircularProgress />
      )}
    </SalesCardsContainer>
  );
};

export default memo(SalesCards);
