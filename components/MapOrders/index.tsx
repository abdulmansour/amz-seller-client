import { useState, useCallback } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  InfoWindoOrderItem,
  InfoWindoOrderItems,
  InfoWindowContainer,
  InfoWindowHeader,
  InfoWindowLabel,
  InfoWindowOrderTotal,
  InfoWindowRow,
  InfoWindowValue,
  MapOrdersContainer,
} from "./styled";
import Link from "next/link";
import { CustomOrder } from "../../pages";
import dateFormat from "dateformat";
import { OrdersList } from "../OrdersList";

const containerStyle = {
  width: "60vw",
  height: "60vh",
};

const defaultLatLng = {
  lat: 43.7946525,
  lng: -79.2371852,
};

const defaultZoom = 4;

export interface MapOrdersProps {
  orders: CustomOrder[] | undefined;
}

// https://www.npmjs.com/package/@react-google-maps/api
// https://react-google-maps-api-docs.netlify.app/
const MapOrders = ({ orders }: MapOrdersProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCX2Dlp4vFD1ppaPJt3iLDHe0B4liHI0lU",
  });

  const [center, setCenter] = useState(defaultLatLng);
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | undefined>(
    undefined
  );

  const [map, setMap] = useState<google.maps.Map>();

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(undefined);
  }, []);

  const handleMouseOver = (order: CustomOrder | undefined) => {
    setSelectedOrder(order);
  };

  const handleMouseOut = (order: CustomOrder | undefined) => {
    setSelectedOrder(undefined);
  };

  const handleInfoWindoCloseClick = () => {
    setSelectedOrder(undefined);
  };

  const getTotalItemPrice = (
    itemPrice: string | undefined,
    itemTax: string | undefined,
    itemShippingPrice: string | undefined,
    itemShippingDiscount: string | undefined,
    itemPromotionDiscount: string | undefined,
    itemGiftWrapPrice: string | undefined,
    itemGiftWrapTax: string | undefined
  ) => {
    return (
      (itemPrice ? parseFloat(itemPrice) : 0) +
      (itemTax ? parseFloat(itemTax) : 0) +
      (itemGiftWrapPrice ? parseFloat(itemGiftWrapPrice) : 0) +
      (itemGiftWrapTax ? parseFloat(itemGiftWrapTax) : 0) +
      (itemShippingPrice ? parseFloat(itemShippingPrice) : 0) -
      (itemShippingDiscount ? parseFloat(itemShippingDiscount) : 0) -
      (itemPromotionDiscount ? parseFloat(itemPromotionDiscount) : 0)
    ).toFixed(2);
  };

  const getDateToString = (str: string) => {
    const date = new Date(str);
    return dateFormat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
  };

  const handleMarkerClick = (order: CustomOrder) => {
    const _lat = order.ShippingAddressGeoLocation?.latitude;
    const _lng = order.ShippingAddressGeoLocation?.longitude;
    if (_lat && _lng) {
      setCenter({
        lat: _lat,
        lng: _lng,
      });

      map?.setZoom(8);
      console.log(order);
    }
  };

  return isLoaded ? (
    <MapOrdersContainer>
      <GoogleMap
        onLoad={onLoad}
        onUnmount={onUnmount}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={defaultZoom}
        onZoomChanged={() => {
          const _zoom = map?.getZoom();
          if (_zoom && _zoom < defaultZoom) {
            map?.setZoom(defaultZoom);
          }
        }}
      >
        {orders?.map((order) => {
          if (
            order?.ShippingAddressGeoLocation?.latitude &&
            order?.ShippingAddressGeoLocation?.longitude
          )
            return (
              <Marker
                onClick={() => handleMarkerClick(order)}
                onMouseOver={() => handleMouseOver(order)}
                onMouseOut={() => null}
                key={order.AmazonOrderId}
                position={{
                  lat: order?.ShippingAddressGeoLocation?.latitude,
                  lng: order?.ShippingAddressGeoLocation?.longitude,
                }}
              >
                {selectedOrder?.AmazonOrderId === order.AmazonOrderId && (
                  <InfoWindow
                    options={{ maxWidth: 400 }}
                    position={{
                      lat: order?.ShippingAddressGeoLocation?.latitude,
                      lng: order?.ShippingAddressGeoLocation?.longitude,
                    }}
                    onCloseClick={() => handleInfoWindoCloseClick()}
                  >
                    <InfoWindowContainer>
                      <InfoWindowHeader>
                        <Link href={`/orders/${order.AmazonOrderId}`}>
                          {order.AmazonOrderId}
                        </Link>
                      </InfoWindowHeader>

                      <InfoWindoOrderItems>
                        {order?.OrderItems?.map((item) => {
                          return (
                            <InfoWindoOrderItem key={item.OrderItemId}>
                              <InfoWindowRow>
                                <InfoWindowLabel>Purchase Date</InfoWindowLabel>
                                <InfoWindowValue>
                                  {getDateToString(order.PurchaseDate)}
                                </InfoWindowValue>
                              </InfoWindowRow>
                              <InfoWindowRow>
                                <InfoWindowLabel>Title</InfoWindowLabel>
                                <InfoWindowValue>{item.Title}</InfoWindowValue>
                              </InfoWindowRow>
                              <InfoWindowRow>
                                <InfoWindowLabel>SKU</InfoWindowLabel>
                                <InfoWindowValue>
                                  {item.SellerSKU}
                                </InfoWindowValue>
                              </InfoWindowRow>
                              <InfoWindowRow>
                                <InfoWindowLabel>
                                  Quantity Ordered
                                </InfoWindowLabel>
                                <InfoWindowValue>
                                  {item.QuantityOrdered}
                                </InfoWindowValue>
                              </InfoWindowRow>
                              <InfoWindowRow>
                                <InfoWindowLabel>Item Price</InfoWindowLabel>
                                <InfoWindowValue>
                                  {getTotalItemPrice(
                                    item.ItemPrice?.Amount,
                                    item.ItemTax?.Amount,
                                    item?.ShippingPrice?.Amount,
                                    item?.ShippingDiscount?.Amount,
                                    item.PromotionDiscount?.Amount,
                                    item?.BuyerInfo?.GiftWrapPrice?.Amount,
                                    item?.BuyerInfo?.GiftWrapTax?.Amount
                                  )}{" "}
                                  {item.ItemPrice?.CurrencyCode}
                                </InfoWindowValue>
                              </InfoWindowRow>
                            </InfoWindoOrderItem>
                          );
                        })}
                      </InfoWindoOrderItems>
                      <InfoWindowOrderTotal>
                        {order.OrderTotal?.Amount}{" "}
                        {order.OrderTotal?.CurrencyCode}
                      </InfoWindowOrderTotal>
                    </InfoWindowContainer>
                  </InfoWindow>
                )}
              </Marker>
            );
        })}
      </GoogleMap>
      <OrdersList
        orders={orders}
        handleMouseOver={handleMouseOver}
        handleOnClick={handleMarkerClick}
        selectedOrder={selectedOrder}
      />
    </MapOrdersContainer>
  ) : (
    <></>
  );
};

export default MapOrders;
