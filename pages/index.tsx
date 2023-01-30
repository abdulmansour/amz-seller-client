import { Order, OrderItem } from "@sp-api-sdk/orders-api-v0";
import MapOrders from "../components/MapOrders";
import {
  FiltersContainer,
  HomePageContainer,
  MainContainer,
  VerticalContainer,
} from "../layout/HomePage/styled";
import Navbar from "../layout/NavBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { useOrders } from "../hooks/orders";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { greedyPollOrders } from "../hooks/greedyPollOrders";
import FilterGroup, { FilterOption } from "../components/FilterGroup";

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
  SKU = "SKU",
  ORDER_STATUS = "Status",
  MARKETPLACE = "Marketplace",
}

export const martketplaceIdToCountry = (marketplaceId: string) => {
  if (marketplaceId === "ATVPDKIKX0DER") return "USA";
  if (marketplaceId === "A2EUQ1WTGCTBG2") return "CA";
  if (marketplaceId === "A1AM78C64UM0Y8") return "MX";
};

const HomePage = () => {
  const getStartDate = (): Date => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  };
  const [pickerDateRange, setPickerDateRange] = useState<
    [Date | null, Date | null]
  >([getStartDate(), new Date()]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    getStartDate(),
    new Date(),
  ]);
  const [pickerStartDate, pickerEndDate] = pickerDateRange;
  const [startDate, endDate] = dateRange;
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
          const filterOption = filters?.Marketplace?.[
            order.MarketplaceId
          ] as FilterOption;

          _marketplaceMap[order.MarketplaceId] = {
            label: martketplaceIdToCountry(order.MarketplaceId) || "None",
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
          const filterOption = filters?.Status?.[
            order.OrderStatus
          ] as FilterOption;
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
              const filterOption = filters?.SKU?.[
                item.SellerSKU
              ] as FilterOption;
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
          Object.entries(filterValue).forEach(([optionKey, optionValue]) => {
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
          Object.entries(filterValue).forEach(([optionKey, optionValue]) => {
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
          <DatePicker
            dateFormat="P"
            selectsRange={true}
            startDate={pickerStartDate}
            endDate={pickerEndDate}
            onChange={(update) => {
              if (update[1]) update[1].setUTCHours(23, 59, 59, 999);
              setPickerDateRange(update);
            }}
            onCalendarClose={() => {
              setDateRange(pickerDateRange);
            }}
          />
          <MapOrders orders={filteredOrders} />
        </VerticalContainer>
      </MainContainer>
      <LoadingSpinner loading={isLoading ? 1 : 0} />
    </HomePageContainer>
  );
};

export default HomePage;
