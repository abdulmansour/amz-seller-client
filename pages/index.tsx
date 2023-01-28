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
    useState<Record<FilterLabels, FilterOption[] | undefined>>();

  useEffect(() => {
    greedyPollOrders();
  }, []);

  useEffect(() => {
    setFilteredOrders(orders);

    const marketplaceValues: Record<string, boolean> = {};
    const marketplaceOptions = orders?.reduce((a, order) => {
      if (order.MarketplaceId && !(order.MarketplaceId in marketplaceValues)) {
        marketplaceValues[order.MarketplaceId] = true;
        a.push({
          label: martketplaceIdToCountry(order.MarketplaceId) || "None",
          value: order.MarketplaceId,
        });
      }
      return a;
    }, [] as FilterOption[]);

    const statusValues: Record<string, boolean> = {};
    const statusOptions = orders?.reduce((a, order) => {
      if (order.OrderStatus && !(order.OrderStatus in statusValues)) {
        statusValues[order.OrderStatus] = true;
        a.push({
          label: order.OrderStatus,
          value: order.OrderStatus,
        });
      }
      return a;
    }, [] as FilterOption[]);

    const skuValues: Record<string, boolean> = {};
    const skuOptions = orders?.reduce((a, order) => {
      order.OrderItems?.forEach((item) => {
        if (item.SellerSKU && !(item.SellerSKU in skuValues)) {
          skuValues[item.SellerSKU] = true;
          a.push({ label: item.SellerSKU, value: item.SellerSKU });
        }
      });
      return a;
    }, [] as FilterOption[]);

    const _filters = {
      [FilterLabels.MARKETPLACE]: marketplaceOptions,
      [FilterLabels.ORDER_STATUS]: statusOptions,
      [FilterLabels.SKU]: skuOptions,
    };
    setFilters(_filters);
  }, [orders]);

  const handleFilterChange = (
    label: FilterLabels,
    options: FilterOption[] | undefined
  ) => {
    if (filters) {
      setFilters({ ...filters, [label]: options });
    }
  };

  useEffect(() => {
    const marketplaceValues = filters?.[FilterLabels.MARKETPLACE]?.reduce(
      (a, option) => {
        if (option.selected) a.push(option.value);
        return a;
      },
      [] as string[]
    );

    const statusValues = filters?.[FilterLabels.ORDER_STATUS]?.reduce(
      (a, option) => {
        if (option.selected) a.push(option.value);
        return a;
      },
      [] as string[]
    );

    const skuValues = filters?.[FilterLabels.SKU]?.reduce((a, option) => {
      if (option.selected) a.push(option.value);
      return a;
    }, [] as string[]);

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
            (order.OrderStatus && statusValues.includes(order.OrderStatus))) &&
          (skuValues.length === 0 ||
            orderSkus?.some((sku) => sku && skuValues.includes(sku)))
        ) {
          return true;
        }
      }
    });

    // add a useEffect to listen to changes to filteredOrders,
    // compute the _filters of filteredOrders and compare them with current filters,
    // if not same then replace

    setFilteredOrders(_orders);
  }, [filters]);

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
                  filterOptions={filters[key as FilterLabels]}
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
      <LoadingSpinner loading={isLoading} />
    </HomePageContainer>
  );
};

export default HomePage;
