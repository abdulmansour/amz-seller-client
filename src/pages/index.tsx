import FilterGroup, { FilterOption } from '@components/FilterGroup';
import { LoadingSpinner } from '@components/LoadingSpinner';
import MapOrders from '@components/MapOrders';
import OrdersTable from '@components/OrdersTable';
import { Currency } from '@components/SalesCard';
import { SalesCards } from '@components/SalesCards';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { greedyPollOrders } from '@hooks/greedyPollOrders';
import { useOrders } from '@hooks/orders';
import { useForex } from '@hooks/useForex';
import {
  FiltersContainer,
  FiltersRow,
  HomePageContainer,
  MainContainer,
  MapSectionContainer,
  MobileFiltersContainer,
  MobileFiltersXContainer,
} from '@layout/HomePage/styled';
import {
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Order, OrderItem } from '@sp-api-sdk/orders-api-v0';
import {
  formatDateLabel,
  predefinedRanges,
  setToEndOfDate,
  setToStartOfDate,
  subDays,
} from '@utils/dateRanges';
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
  displayMarker?: boolean;
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

const HomePage = () => {
  const baseRateCurrency = Currency.USD;
  const targetCurrency = Currency.USD;
  const currencies = [Currency.CAD, Currency.MXN];
  const { rates } = useForex(baseRateCurrency, currencies);

  const [dateRange, setDateRange] = useState<DateRange | null>([
    setToStartOfDate(subDays(new Date(), 6)),
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isMobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <SalesCards
        orders={filteredOrders}
        dateRange={dateRange}
        rates={rates}
        targetCurrency={targetCurrency}
      />
      <MainContainer elevation={3}>
        {!isMobile && (
          <FiltersContainer>
            {filters &&
              Object.keys(filters).map((key) => {
                return (
                  <FilterGroup
                    key={key}
                    filterLabel={key}
                    filterOptions={
                      filters[key as FilterLabels] as Record<
                        string,
                        FilterOption
                      >
                    }
                    handleFilterChange={handleFilterChange}
                  />
                );
              })}
          </FiltersContainer>
        )}
        {isMobile && (
          <MobileFiltersContainer open={isMobileFiltersOpen}>
            <FiltersContainer>
              <MobileFiltersXContainer>
                <Typography sx={{ fontWeight: 600, fontSize: '18px' }}>
                  Filters
                </Typography>
                <IconButton
                  onClick={() =>
                    setMobileFiltersOpen(isMobileFiltersOpen ? false : true)
                  }
                >
                  <FontAwesomeIcon icon={faXmark} />
                </IconButton>
              </MobileFiltersXContainer>
              {filters &&
                Object.keys(filters).map((key) => {
                  return (
                    <FilterGroup
                      key={key}
                      filterLabel={key}
                      filterOptions={
                        filters[key as FilterLabels] as Record<
                          string,
                          FilterOption
                        >
                      }
                      handleFilterChange={handleFilterChange}
                    />
                  );
                })}
            </FiltersContainer>
          </MobileFiltersContainer>
        )}
        <MapSectionContainer>
          <FiltersRow>
            <DateRangePicker
              renderValue={([startDate, endDate]) => {
                return `${formatDateLabel(startDate)} - ${formatDateLabel(
                  endDate
                )}`;
              }}
              showOneCalendar
              ranges={predefinedRanges}
              placeholder="Select date range"
              value={dateRange}
              onChange={(update) => {
                if (update) {
                  const _dateRange: DateRange = [
                    setToStartOfDate(update[0]),
                    setToEndOfDate(update[1]),
                  ];
                  setDateRange(_dateRange);
                }
              }}
            />
            {isMobile && (
              <Button
                onClick={() =>
                  setMobileFiltersOpen(isMobileFiltersOpen ? false : true)
                }
              >
                Filters
              </Button>
            )}
            {/* <FilterChips /> */}
          </FiltersRow>
          <MapOrders
            orders={filteredOrders as CustomOrder[]}
            clusterize={false}
            clusterSize={5}
          />
        </MapSectionContainer>
      </MainContainer>

      <OrdersTable
        orders={filteredOrders}
        rates={rates}
        targetCurrency={targetCurrency}
      />

      <LoadingSpinner loading={isLoading ? 1 : 0} />
    </HomePageContainer>
  );
};

export default HomePage;
