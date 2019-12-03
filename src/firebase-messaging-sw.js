importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.3.0/workbox-sw.js');

importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

firebase.initializeApp({
  messagingSenderId: '930957800364'
});

var messaging = firebase.messaging();

// Force production builds
workbox.setConfig({ debug: false });

workbox.routing.registerRoute(
  /\.(?:js|html|json|css|png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.staleWhileRevalidate(
        {
      cacheName: 'Reeltime Cashe',
      cacheableResponse: {statuses: [0, 200]},
      maxAgeSeconds: 10 * 60
      }
    )
);

// https://app.reeltimecoaching.com/

workbox.routing.registerRoute(
  new RegExp('https://app.reeltimecoaching.com/(.*)'),
  workbox.strategies.networkFirst({
    cacheName: 'API',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
    ],
  }),
);