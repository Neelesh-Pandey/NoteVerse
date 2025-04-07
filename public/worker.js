// public/worker.js

const CACHE_NAME = 'likhit-cache-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  // Add more URLs to cache as needed
];

// Install Service Worker and cache key assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching important URLs');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker and remove old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch requests and respond with cache if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() =>
        caches.match('/')
      ); // fallback to homepage if offline
    })
  );
});
