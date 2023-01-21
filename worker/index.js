import { ExpirationPlugin } from "workbox-expiration";
import { CacheFirst } from "workbox-strategies";
import { registerRoute } from "workbox-routing";

registerRoute(
  /\/api\/orders$/i,
  new CacheFirst({
    cacheName: "api-orders",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1,
      }),
    ],
  }),
  "GET"
);
