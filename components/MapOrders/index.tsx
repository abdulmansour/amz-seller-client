import { useState, useCallback } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Order, OrderItem } from "@sp-api-sdk/orders-api-v0";
import {
  InfoWindoOrderItem,
  InfoWindoOrderItems,
  InfoWindowContainer,
  InfoWindowHeader,
  InfoWindowLabel,
  InfoWindowOrderTotal,
  InfoWindowRow,
  InfoWindowValue,
} from "./styled";
import Link from "next/link";
import { useOrders } from "../../hooks/orders";
import { CustomOrder } from "../../pages";

const containerStyle = {
  width: "100%",
  height: "650px",
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
  const [zoom, setZoom] = useState(defaultZoom);
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

  return isLoaded && orders ? (
    <GoogleMap
      onLoad={onLoad}
      onUnmount={onUnmount}
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onZoomChanged={() => {
        const _zoom = map?.getZoom();
        if (_zoom !== zoom && _zoom) setZoom(_zoom);
      }}
    >
      {orders?.map((order) => {
        if (
          order?.ShippingAddressGeoLocation?.latitude &&
          order?.ShippingAddressGeoLocation?.longitude
        )
          return (
            <Marker
              onClick={(e) => {
                const _lat = e.latLng?.lat();
                const _lng = e.latLng?.lng();

                setCenter({
                  lat: _lat ? _lat : defaultLatLng.lat,
                  lng: _lng ? _lng : defaultLatLng.lng,
                });

                setZoom(8);
                console.log(order);
              }}
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
  ) : (
    <></>
  );
};

export default MapOrders;
