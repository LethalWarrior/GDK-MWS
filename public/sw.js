const staticCacheName = "robby-mws-static";

// list of assets to cache on install
// cache each restaurant detail page as well
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache
        .addAll([
          "/index.html",
          // '/restaurant.html',
          "/css/main.css",
          "/js/map.js",
          "/js/register_sw.js",
          "/project1/calculator.html",
          "/project2/mapbox.html",
          "/project3/fetchjson.html",
          "/manifest.json",
          "/images"
        ])
        .catch(error => {
          console.log("Caches open failed: " + error);
        });
    })
  );
});

// intercept all requests
// either return cached asset or fetch from network
self.addEventListener("fetch", event => {
  event.respondWith(
    // Add cache.put to cache images on each fetch
    caches
      .match(event.request)
      .then(response => {
        return (
          response ||
          fetch(event.request).then(fetchResponse => {
            return caches.open(staticCacheName).then(cache => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          })
        );
      })
      .catch(error => {
        return new Response("Not connected to the internet", {
          status: 404,
          statusText: "Not connected to the internet"
        });
      })
  );
});

// delete old/unused static caches
self.addEventListener("activate", event => {
  event.waitUntil(
    // caches.delete('-restaurant-static-001')
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return (
              cacheName.startsWith("robby-mws-static") &&
              cacheName !== staticCacheName
            );
          })
          .map(cacheName => {
            return caches.delete(cacheName);
          })
      );
    })
  );
});
