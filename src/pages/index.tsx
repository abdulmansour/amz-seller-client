import FilterGroup, { FilterOption } from '@components/FilterGroup';
import { LoadingSpinner } from '@components/LoadingSpinner';
import MapOrders from '@components/MapOrders';
import OrdersTable from '@components/OrdersTable';
import { Currency } from '@components/SalesCard';
import SalesCards from '@components/SalesCards';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForex } from '@hooks/useForex';
import { useGreedyPollOrders } from '@hooks/useGreedyPollOrders';
import { OrdersData, useOrders } from '@hooks/useOrders';
import {
  FiltersContainer,
  FiltersRow,
  HomePageContainer,
  MainContainer,
  MapSectionContainer,
  MobileFiltersContainer,
  MobileFiltersXContainer,
} from '@layout/HomePage/styled';
import Navbar from '@layout/NavBar';
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
import { useContext, useEffect, useState } from 'react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import { AuthContext } from 'src/contexts/AuthContext';

export interface CustomOrder extends Order {
  ShippingAddressGeoLocation?: {
    latitude?: number;
    longitude?: number;
  };
  OrderItems?: OrderItem[];
  displayMarker?: boolean;
  ref?: React.RefObject<HTMLDivElement>;
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isMobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  const { user } = useContext(AuthContext);

  const [dateRange, setDateRange] = useState<DateRange>([
    setToStartOfDate(subDays(new Date(), 6)),
    new Date(),
  ]);
  const {
    orders: initialOrders,
    filters: initialFilters,
    loading: initalLoading,
  } = useOrders(dateRange);
  const [filteredData, setFilteredData] = useState<OrdersData>({
    orders: undefined,
    filters: undefined,
    loading: false,
  });

  const { orders, filters, loading } = filteredData;

  useEffect(() => {
    setFilteredData({
      orders: initialOrders,
      filters: initialFilters,
      loading: initalLoading,
    });
  }, [initialOrders, initialFilters, initalLoading]);

  // when filter is selected: update filters with updated selection/counts
  const handleFilterChange = (
    label: FilterLabels,
    options: Record<string, FilterOption>
  ) => {
    const _filters = { ...filters, [label]: options } as {
      SKU: Record<string, FilterOption> | undefined;
      Status: Record<string, FilterOption> | undefined;
      Marketplace: Record<string, FilterOption> | undefined;
    };

    if (
      _filters?.[FilterLabels.MARKETPLACE] &&
      _filters?.[FilterLabels.ORDER_STATUS] &&
      _filters?.[FilterLabels.SKU]
    ) {
      const marketplaceValues = Object.values(
        _filters[FilterLabels.MARKETPLACE]
      ).reduce((a, option) => {
        if (option.selected) a.push(option.value);
        return a;
      }, [] as string[]);

      const statusValues = Object.values(
        _filters?.[FilterLabels.ORDER_STATUS]
      )?.reduce((a, option) => {
        if (option.selected) a.push(option.value);
        return a;
      }, [] as string[]);

      const skuValues = Object.values(_filters?.[FilterLabels.SKU])?.reduce(
        (a, option) => {
          if (option.selected) a.push(option.value);
          return a;
        },
        [] as string[]
      );

      const _orders = initialOrders?.filter((order) => {
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
      setFilteredData({
        ...filteredData,
        orders: _orders,
        filters: computeFiltersCount(_filters),
      });
    }
  };

  const computeFiltersCount = (
    _filters: Record<FilterLabels, Record<string, FilterOption> | undefined>
  ) => {
    if (initialOrders) {
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

            const count = initialOrders.reduce((a, order) => {
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

  useGreedyPollOrders();

  return (
    <>
      {user && (
        <HomePageContainer>
          <Navbar />
          <SalesCards
            orders={orders}
            dateRange={dateRange}
            rates={rates}
            targetCurrency={targetCurrency}
            skuFilters={filters?.SKU}
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
                orders={orders as CustomOrder[]}
                clusterize={false}
                clusterSize={5}
              />
            </MapSectionContainer>
          </MainContainer>

          <OrdersTable
            orders={orders}
            rates={rates}
            targetCurrency={targetCurrency}
            skuFilters={filters?.SKU}
          />
        </HomePageContainer>
      )}
      {(!user || loading) && <LoadingSpinner loading={1} />}
    </>
  );
};

export default HomePage;
