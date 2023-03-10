import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

self.__WB_DISABLE_DEV_LOGS = true;

registerRoute(
  /\/api\/gcs-json-gz.*isMobile=true.*$/i,
  new CacheFirst({
    cacheName: 'gcs-json-gz',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 15 * 60,
      }),
    ],
  }),
  'GET'
);

registerRoute(
  /\/api\/gcs-json-gz.*isMobile=false.*$/i,
  new CacheFirst({
    cacheName: 'gcs-json-gz',
  }),
  'GET'
);

registerRoute(
  /\/api\/firestore-orders.*$/i,
  new CacheFirst({
    cacheName: 'firestore-orders',
  }),
  'GET'
);

registerRoute(
  /\/api\/forex.*$/i,
  new CacheFirst({
    cacheName: 'forex',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  }),
  'GET'
);

registerRoute(
  /\/api\/sp-api.*$/i,
  new CacheFirst({
    cacheName: 'sp-api',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 5 * 60,
      }),
    ],
  }),
  'GET'
);
