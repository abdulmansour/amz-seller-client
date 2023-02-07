import {
  InfoWindoOrderItem,
  InfoWindoOrderItems,
  InfoWindowContainer,
  InfoWindowHeader,
  InfoWindowLabel,
  InfoWindowOrderTotal,
  InfoWindowRow,
  InfoWindowValue,
} from '@components/MapOrders/styled';
import {
  computeItemPrice,
  computeOrderedUnits,
  _parseFloat,
} from '@components/OrdersTable';
import { CustomOrder } from '@pages/index';
import { InfoWindow, Marker, MarkerClusterer } from '@react-google-maps/api';
import { Clusterer } from '@react-google-maps/marker-clusterer';
import { getDateToString } from '@utils/dateRanges';
import currency from 'currency.js';
import Link from 'next/link';
import { memo } from 'react';

export interface CustomMarkerProps {
  order: CustomOrder;
  clusterer: Clusterer | MarkerClusterer | undefined;
  isSelectedOrder: boolean;
  handleMarkerClick: (order: CustomOrder) => void;
  handleMouseOver: (order: CustomOrder | undefined) => void;
  handleInfoWindoCloseClick: () => void;
}

const CustomMarker = ({
  order,
  clusterer,
  isSelectedOrder,
  handleMarkerClick,
  handleMouseOver,
  handleInfoWindoCloseClick,
}: CustomMarkerProps) => {
  return (
    <Marker
      onClick={() => {
        handleMarkerClick(order);
      }}
      onMouseOver={() => handleMouseOver(order)}
      onMouseOut={() => null}
      key={order.AmazonOrderId}
      position={{
        lat: order?.ShippingAddressGeoLocation?.latitude as number,
        lng: order?.ShippingAddressGeoLocation?.longitude as number,
      }}
      clusterer={clusterer ? (clusterer as Clusterer) : undefined}
    >
      {isSelectedOrder && (
        <InfoWindow
          options={{ maxWidth: 400 }}
          position={{
            lat: order?.ShippingAddressGeoLocation?.latitude as number,
            lng: order?.ShippingAddressGeoLocation?.longitude as number,
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
              <InfoWindowRow>
                <InfoWindowLabel>Purchase Date</InfoWindowLabel>
                <InfoWindowValue>
                  {getDateToString(order.PurchaseDate)}
                </InfoWindowValue>
              </InfoWindowRow>
              {order?.OrderItems?.map((item) => {
                return (
                  <InfoWindoOrderItem key={item.OrderItemId}>
                    <InfoWindowRow>
                      <InfoWindowLabel>Title</InfoWindowLabel>
                      <InfoWindowValue>{item.Title}</InfoWindowValue>
                    </InfoWindowRow>
                    <InfoWindowRow>
                      <InfoWindowLabel>SKU</InfoWindowLabel>
                      <InfoWindowValue>{item.SellerSKU}</InfoWindowValue>
                    </InfoWindowRow>
                    <InfoWindowRow>
                      <InfoWindowLabel>Quantity</InfoWindowLabel>
                      <InfoWindowValue>{item.QuantityOrdered}</InfoWindowValue>
                    </InfoWindowRow>
                    <InfoWindowRow>
                      <InfoWindowLabel>Item Price</InfoWindowLabel>
                      <InfoWindowValue>
                        {currency(
                          computeItemPrice(item, computeOrderedUnits(item))
                        ).format()}{' '}
                        {item.ItemPrice?.CurrencyCode}
                      </InfoWindowValue>
                    </InfoWindowRow>
                  </InfoWindoOrderItem>
                );
              })}
            </InfoWindoOrderItems>
            <InfoWindowOrderTotal>
              {currency(_parseFloat(order.OrderTotal?.Amount)).format()}{' '}
              {order.OrderTotal?.CurrencyCode}
            </InfoWindowOrderTotal>
          </InfoWindowContainer>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default memo(CustomMarker);
