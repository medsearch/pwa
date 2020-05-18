const CACHE_NAME = 'sw-cache-pwa';
const toCache = [
  //'./',
  './offline.html',
  //'./js/status.js',
  //'./images/apple-touch.png',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(toCache)
      })
      .then(self.skipWaiting())
  )
})
  
self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
            .then((cache) => {
              return cache.match('offline.html')
            })
        })
    )
  })
  
  self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys()
        .then((keyList) => {
          return Promise.all(keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('[ServiceWorker] Removing old cache', key)
              return caches.delete(key)
            }
          }))
        })
        .then(() => self.clients.claim())
    )
  })

self.addEventListener('push', event => {
  console.log(event);
    const dataJSON = event.data.json();

    const notificationOptions = {
        body: dataJSON.body,
    };

    return self.registration.showNotification(dataJSON.title, notificationOptions);
});
