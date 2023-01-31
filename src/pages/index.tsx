import FilterGroup, { FilterOption } from '@components/FilterGroup';
import { LoadingSpinner } from '@components/LoadingSpinner';
import MapOrders from '@components/MapOrders';
import { greedyPollOrders } from '@hooks/greedyPollOrders';
import { useOrders } from '@hooks/orders';
import {
  FiltersContainer,
  HomePageContainer,
  MainContainer,
  VerticalContainer,
} from '@layout/HomePage/styled';
import Navbar from '@layout/NavBar';
import { Order, OrderItem } from '@sp-api-sdk/orders-api-v0';
import { predefinedRanges, subDays } from '@utils/dateRanges';
import { useEffect, useState } from 'react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { DateRange } from 'rsuite/esm/DateRangePicker';

export interface CustomOrder extends Order {
  ShippingAddressGeoLocation?: {
    latitude?: number;
    longitude?: number;
  };
  OrderItems?: OrderItem[];
}

export interface HomePageProps {
  orders: CustomOrder[] | undefined;
}

export enum FilterLabels {
  SKU = 'SKU',
  ORDER_STATUS = 'Status',
  MARKETPLACE = 'Marketplace',
}

export const martketplaceIdToCountry = (marketplaceId: string) => {
  if (marketplaceId === 'ATVPDKIKX0DER') return 'USA';
  if (marketplaceId === 'A2EUQ1WTGCTBG2') return 'CA';
  if (marketplaceId === 'A1AM78C64UM0Y8') return 'MX';
};

export const getStartDate = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
};

export const startOfDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const HomePage = () => {
  const [dateRange, setDateRange] = useState<DateRange | null>([
    startOfDay(subDays(new Date(), 6)),
    new Date(),
  ]);

  const [startDate, endDate] = [dateRange?.[0], dateRange?.[1]];
  const { orders, isOrdersLoading } = useOrders({ startDate, endDate });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [filteredOrders, setFilteredOrders] = useState<
    CustomOrder[] | undefined
  >([]);

  const [filters, setFilters] =
    useState<Record<FilterLabels, Record<string, FilterOption> | undefined>>();

  useEffect(() => {
    setLoading(isOrdersLoading);
  }, [isOrdersLoading]);

  useEffect(() => {
    greedyPollOrders();
  }, []);

  // when orders change, recompute filters and reinitialize filteredOrders
  useEffect(() => {
    setLoading(true);
    const _marketplaceMap: Record<string, FilterOption> = {};
    orders?.forEach((order) => {
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
    orders?.forEach((order) => {
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
    orders?.forEach((order) => {
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

    setFilters(_filters);
    setLoading(false);
  }, [orders]);

  // when filters are initialized and when filter option is selected: generate filteredOrders
  useEffect(() => {
    if (
      filters?.[FilterLabels.MARKETPLACE] &&
      filters?.[FilterLabels.ORDER_STATUS] &&
      filters?.[FilterLabels.SKU]
    ) {
      const marketplaceValues = Object.values(
        filters[FilterLabels.MARKETPLACE]
      ).reduce((a, option) => {
        if (option.selected) a.push(option.value);
        return a;
      }, [] as string[]);

      const statusValues = Object.values(
        filters?.[FilterLabels.ORDER_STATUS]
      )?.reduce((a, option) => {
        if (option.selected) a.push(option.value);
        return a;
      }, [] as string[]);

      const skuValues = Object.values(filters?.[FilterLabels.SKU])?.reduce(
        (a, option) => {
          if (option.selected) a.push(option.value);
          return a;
        },
        [] as string[]
      );

      const _orders = orders?.filter((order) => {
        if (marketplaceValues && statusValues && skuValues) {
          const orderSkus = order.OrderItems?.map((item) => {
            return item.SellerSKU;
          });

          if (
            (marketplaceValues.length === 0 ||
              (order.MarketplaceId &&
                marketplaceValues.includes(order.MarketplaceId))) &&
            (statusValues.length === 0 ||
              (order.OrderStatus &&
                statusValues.includes(order.OrderStatus))) &&
            (skuValues.length === 0 ||
              orderSkus?.some((sku) => sku && skuValues.includes(sku)))
          ) {
            return true;
          }
        }
      });
      setFilteredOrders(_orders);
      setLoading(false);
    }
  }, [filters]);

  // when filter is selected: update filters with updated selection/counts
  const handleFilterChange = (
    label: FilterLabels,
    options: Record<string, FilterOption>
  ) => {
    if (filters && orders) {
      setLoading(true);
      const _filters = { ...filters, [label]: options };
      setFilters(computeFiltersCount(_filters));
    }
  };

  const computeFiltersCount = (
    _filters: Record<FilterLabels, Record<string, FilterOption> | undefined>
  ) => {
    if (orders) {
      const selectedOptionsMap: Record<FilterLabels, string[]> = {} as Record<
        FilterLabels,
        string[]
      >;
      Object.entries(_filters).forEach(([filterKey, filterValue]) => {
        if (filterValue) {
          Object.entries(filterValue).forEach(([, optionValue]) => {
            if (optionValue.selected) {
              if (!(filterKey in selectedOptionsMap)) {
                selectedOptionsMap[filterKey as FilterLabels] = [
                  optionValue.value,
                ];
              } else {
                selectedOptionsMap[filterKey as FilterLabels] =
                  selectedOptionsMap[filterKey as FilterLabels].concat([
                    optionValue.value,
                  ]);
              }
            }
          });
        }
      });

      Object.entries(_filters).forEach(([filterKey, filterValue]) => {
        if (filterValue) {
          Object.entries(filterValue).forEach(([, optionValue]) => {
            const _selectedOptionsMap = {
              ...selectedOptionsMap,
              [filterKey]: [optionValue.value],
            };

            const count = orders.reduce((a, order) => {
              const orderSkus = order.OrderItems?.map((item) => {
                return item.SellerSKU;
              });
              if (
                order.MarketplaceId &&
                (!_selectedOptionsMap[FilterLabels.MARKETPLACE] ||
                  _selectedOptionsMap[FilterLabels.MARKETPLACE].includes(
                    order.MarketplaceId
                  )) &&
                order.OrderStatus &&
                (!_selectedOptionsMap[FilterLabels.ORDER_STATUS] ||
                  _selectedOptionsMap[FilterLabels.ORDER_STATUS].includes(
                    order.OrderStatus
                  )) &&
                orderSkus &&
                (!_selectedOptionsMap[FilterLabels.SKU] ||
                  orderSkus?.some(
                    (sku) =>
                      sku && _selectedOptionsMap[FilterLabels.SKU].includes(sku)
                  ))
              )
                return a + 1;
              else return a;
            }, 0);

            optionValue.count = count;
          });
        }
      });
    }
    return _filters;
  };

  return (
    <HomePageContainer>
      <Navbar />
      <MainContainer elevation={6}>
        <FiltersContainer>
          {filters &&
            Object.keys(filters).map((key) => {
              return (
                <FilterGroup
                  key={key}
                  filterLabel={key}
                  filterOptions={
                    filters[key as FilterLabels] as Record<string, FilterOption>
                  }
                  handleFilterChange={handleFilterChange}
                />
              );
            })}
        </FiltersContainer>
        <VerticalContainer>
          <DateRangePicker
            showOneCalendar
            ranges={predefinedRanges}
            placeholder="Select date range"
            value={dateRange}
            onChange={(update) => {
              if (update) {
                const _dateRange: DateRange = [
                  startOfDay(update[0]),
                  update[1],
                ];
                console.log(_dateRange);
                setDateRange(_dateRange);
              }
            }}
          />
          <MapOrders
            orders={filteredOrders as CustomOrder[]}
            clusterize={false}
          />
        </VerticalContainer>
      </MainContainer>
      <LoadingSpinner loading={isLoading ? 1 : 0} />
    </HomePageContainer>
  );
};

export default HomePage;