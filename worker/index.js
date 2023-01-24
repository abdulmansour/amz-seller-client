import { ExpirationPlugin } from "workbox-expiration";
import { CacheFirst } from "workbox-strategies";
import { registerRoute } from "workbox-routing";

registerRoute(
  /\/api\/gcs-json-gz.*$/i,
  new CacheFirst({
    cacheName: "gcs-json-gz",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
      }),
    ],
  }),
  "GET"
);

registerRoute(
  /\/api\/firestore-orders.*$/i,
  new CacheFirst({
    cacheName: "firestore-orders",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
      }),
    ],
  }),
  "GET"
);
