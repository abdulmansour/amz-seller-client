import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@mui/material';
import { CustomOrder } from '@pages/index';
import currency from 'currency.js';
import {
  CurrencyValue,
  SalesCardContainer,
  SalesCardHeader,
  SalesCardItemContainer,
  SalesCardItemHeader,
  SalesCardItemHeaderLabel,
} from './styled';

export interface SalesCardProps {
  salesCardItems: SalesCardItem[];
  headerLabel: string;
}

export interface ForexRates {
  date: string;
  base: Currency;
  rates: Record<Currency, number>;
}
export interface SalesCardItem {
  label: string;
  value: number;
  targetCurrency?: Currency;
  icon: IconDefinition;
}

export enum Currency {
  USD = 'USD',
  MXN = 'MXN',
  CAD = 'CAD',
}

export const computeOrdersSales = (
  orders: CustomOrder[],
  targetCurrency: Currency,
  rates: Record<Currency, number>
) => {
  return orders.reduce((a, order) => {
    if (order?.OrderTotal?.Amount && order?.OrderTotal?.CurrencyCode)
      return (
        a +
        (parseFloat(order?.OrderTotal?.Amount) * rates[targetCurrency]) /
          rates[order.OrderTotal.CurrencyCode as Currency]
      );
    return a;
  }, 0);
};

export const computeOrdersUnits = (orders: CustomOrder[] | undefined) => {
  const units = orders?.reduce((a, order) => {
    const itemUnits = order.OrderItems?.reduce((i, item) => {
      const numberOfItems: string | number | undefined =
        item.ProductInfo?.NumberOfItems;
      if (numberOfItems)
        return (
          i +
          (typeof numberOfItems === 'string'
            ? parseInt(numberOfItems)
            : numberOfItems)
        );

      return i;
    }, 0);
    return a + (itemUnits ? itemUnits : 0);
  }, 0);
  return units ? units : 0;
};

const SalesCard = ({ salesCardItems, headerLabel }: SalesCardProps) => {
  return (
    <SalesCardContainer>
      <SalesCardHeader>{headerLabel}</SalesCardHeader>
      {salesCardItems?.map(({ label, value, targetCurrency, icon }) => {
        return (
          <SalesCardItemContainer key={label}>
            <SalesCardItemHeader>
              <SalesCardItemHeaderLabel>{label}</SalesCardItemHeaderLabel>
              <FontAwesomeIcon icon={icon} size="xl" />
            </SalesCardItemHeader>

            {targetCurrency ? (
              <CurrencyValue>
                {`${currency(value).format()} ${targetCurrency}`}
              </CurrencyValue>
            ) : (
              <Typography>{value}</Typography>
            )}
          </SalesCardItemContainer>
        );
      })}
    </SalesCardContainer>
  );
};

export default SalesCard;
