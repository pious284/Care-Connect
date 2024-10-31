// service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('static-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/css/styles.css',
          '/js/app.js',
          '/images/logo.png',
          // Add other static assets
        ]);
      })
    );
  });
  
