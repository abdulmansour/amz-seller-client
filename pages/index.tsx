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
  const { orders, isLoading } = useOrders({ startDate, endDate });
  const [filteredOrders, setFilteredOrders] = useState<
    CustomOrder[] | undefined
  >([]);

  const [filters, setFilters] =
    useState<Record<FilterLabels, Record<string, FilterOption> | undefined>>();

  useEffect(() => {
    greedyPollOrders();
  }, []);

  // when orders change, recompute filters and reinitialize filteredOrders
  useEffect(() => {
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
            selected: filterOption?.selected ? filterOption.selected : false,
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
            selected: filterOption?.selected ? filterOption.selected : false,
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
                selected: filterOption?.selected
                  ? filterOption.selected
                  : false,
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
    setFilteredOrders(orders);
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
    }
  }, [filters]);

  // when filter is selected: update filters with updated selection/counts
  const handleFilterChange = (
    label: FilterLabels,
    options: Record<string, FilterOption>,
    isCheckedAction: boolean
  ) => {
    if (filters) {
      const _filters = { ...filters, [label]: options };

      // TODO:
      // we generate the count of each filter option by:
      // 0. build map selectedFilterOptionsMap: {filterCategory: [filterOption]}
      // 1. for each filter option that is not selected:
      //    check selectedFilterOptionsMap and skip current filter category
      //    2. for each order in orders:
      //        check remaining selectedFilterOptionsMap
      //        if order matches remaining selectedFilterOptionsMap AND current filter option
      //        => increment count by 1 for filter option
      //   3. store count value for filter option

      setFilters(_filters);
    }
  };

  return (
    <HomePageContainer>
      <Navbar />
      <MainContainer>
        <FiltersContainer>
          {filters ? (
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
            })
          ) : (
            <></>
          )}
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
