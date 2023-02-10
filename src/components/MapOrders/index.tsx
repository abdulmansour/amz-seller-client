import CustomMarker from '@components/MapOrders/CustomMarker';
import OrdersList from '@components/OrdersList';
import { CustomOrder } from '@pages/index';
import {
  GoogleMap,
  MarkerClusterer,
  useJsApiLoader,
} from '@react-google-maps/api';
import { Clusterer } from '@react-google-maps/marker-clusterer';
import { memo, useCallback, useState } from 'react';
import { MapOrdersContainer } from './styled';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultLatLng = {
  lat: 43.7946525,
  lng: -79.2371852,
};

const defaultZoom = 4;

export interface MapOrdersProps {
  orders: CustomOrder[] | undefined;
  clusterize?: boolean;
  clusterSize?: number;
}

// https://www.npmjs.com/package/@react-google-maps/api
// https://react-google-maps-api-docs.netlify.app/
const MapOrders = ({
  orders,
  clusterize = false,
  clusterSize = 2,
}: MapOrdersProps) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string,
  });

  const [center, setCenter] = useState(defaultLatLng);
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | undefined>(
    undefined
  );

  const [map, setMap] = useState<google.maps.Map>();

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(undefined);
  }, []);

  const handleMouseOver = useCallback((order: CustomOrder | undefined) => {
    setSelectedOrder(order);
  }, []);

  const handleInfoWindoCloseClick = useCallback(() => {
    setSelectedOrder(undefined);
  }, []);

  const handleMarkerClick = useCallback(
    (order: CustomOrder) => {
      const _lat = order.ShippingAddressGeoLocation?.latitude;
      const _lng = order.ShippingAddressGeoLocation?.longitude;
      if (_lat && _lng) {
        setCenter({
          lat: _lat,
          lng: _lng,
        });

        map?.setZoom(12);
        // eslint-disable-next-line no-console
        console.log(order);
      }
    },
    [map]
  );

  const display = useCallback((order: CustomOrder) => {
    return order?.ShippingAddressGeoLocation?.latitude &&
      order?.ShippingAddressGeoLocation?.longitude
      ? true
      : false;
  }, []);

  const renderMarkers = useCallback(
    (
      markers: CustomOrder[] | undefined,
      clusterer: Clusterer | MarkerClusterer | undefined
    ) => {
      return markers?.map((order, index) => {
        if (display(order))
          return (
            <CustomMarker
              key={index}
              order={order}
              clusterer={clusterer}
              isSelectedOrder={
                selectedOrder?.AmazonOrderId === order.AmazonOrderId
              }
              handleMarkerClick={handleMarkerClick}
              handleMouseOver={handleMouseOver}
              handleInfoWindoCloseClick={handleInfoWindoCloseClick}
            />
          );
      });
    },
    [selectedOrder?.AmazonOrderId]
  );

  return isLoaded ? (
    <MapOrdersContainer>
      <GoogleMap
        onLoad={onLoad}
        onUnmount={onUnmount}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={defaultZoom}
        options={{ minZoom: defaultZoom }}
      >
        {clusterize ? (
          <MarkerClusterer minimumClusterSize={clusterSize}>
            {(clusterer) => <div>{renderMarkers(orders, clusterer)}</div>}
          </MarkerClusterer>
        ) : (
          renderMarkers(orders, undefined)
        )}
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

export default memo(MapOrders);
