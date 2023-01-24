import { Order, OrderItem } from "@sp-api-sdk/orders-api-v0";
import MapOrders from "../components/MapOrders";
import { HomePageContainer } from "../layout/HomePage/styled";
import Navbar from "../layout/NavBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useOrders } from "../hooks/orders";

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
  const { orders } = useOrders({ startDate, endDate });

  return (
    <HomePageContainer>
      <Navbar />
      <DatePicker
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
      <MapOrders orders={orders} />
    </HomePageContainer>
  );
};

export default HomePage;
