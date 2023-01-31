import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

self.__WB_DISABLE_DEV_LOGS = true;

registerRoute(
  /\/api\/gcs-json-gz.*$/i,
  new CacheFirst({
    cacheName: 'gcs-json-gz',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1000,
      }),
    ],
  }),
  'GET'
);

registerRoute(
  /\/api\/firestore-orders.*$/i,
  new CacheFirst({
    cacheName: 'firestore-orders',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
      }),
    ],
  }),
  'GET'
);
