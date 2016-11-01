var urlsToCache = [];


  urlsToCache.push("");

  urlsToCache.push("");

  urlsToCache.push("");



  
    urlsToCache.push("/about/");
  

  
    urlsToCache.push("/about/");
  

  
    urlsToCache.push("/blog/");
  

  
    urlsToCache.push("/blog/");
  

  

  
    urlsToCache.push("/feed.xml");
  

  

  
    urlsToCache.push("/");
  

  

  
    urlsToCache.push("/css/main.css");
  


var CACHE_NAME = 'home-of-another-front-end-developer-cache-v1';

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(urlsToCache);
  }).catch(function(err) {
    console.log('cache add err', err);
  }));
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

// strategies from the offline cookbook by jake archibald
// https://jakearchibald.com/2014/offline-cookbook/#serving-suggestions-responding-to-requests



  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    );
  });

