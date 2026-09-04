const CACHE_NAME = 'netmonitor-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './devices.html',
  './device-details.html',
  './traffic.html',
  './usage.html',
  './wifi.html',
  './ethernet.html',
  './alerts.html',
  './settings.html',
  './about.html',

  './css/variables.css',
  './css/main.css',
  './css/layout.css',
  './css/components.css',
  './css/responsive.css',
  './css/dark-mode.css',
  './css/dashboard.css',
  './css/devices.css',

  './js/utils.js',
  './js/storage.js',
  './js/theme.js',
  './js/state.js',
  './js/simulation.js',
  './js/app.js',
  './js/index.js',
  './js/devices.js',
  './js/device-details.js',
  './js/traffic.js',
  './js/usage.js',
  './js/wifi.js',
  './js/ethernet.js',
  './js/alerts.js',
  './js/settings.js',
  './js/about.js',
  './js/charts.js',

  './data/devices.json',
  './data/network.json',

  './manifest.webmanifest',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png',

  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install Event - Cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch Event - Cache First Strategy for static assets
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Not in cache - fetch from network
                return fetch(event.request).then(
                    (response) => {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response because it's a stream
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                // Only cache our own origin or known CDNs, avoid caching random API calls in production
                                if (event.request.url.startsWith(self.location.origin) ||
                                    event.request.url.includes('fonts.googleapis.com') ||
                                    event.request.url.includes('cdnjs.cloudflare.com') ||
                                    event.request.url.includes('cdn.jsdelivr.net')) {
                                    cache.put(event.request, responseToCache);
                                }
                            });

                        return response;
                    }
                );
            }).catch(() => {
                // If offline and request is for an HTML page, return index.html as fallback if needed
                // But since it's an MPA and we cached all pages, they should be served from cache above.
            })
    );
});
