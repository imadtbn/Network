const CACHE = 'netmonitor-v1';
const ASSETS = [
  './', 'index.html', 'devices.html', 'device-details.html', 'traffic.html',
  'usage.html', 'wifi.html', 'ethernet.html', 'alerts.html', 'settings.html', 'about.html',
  'css/variables.css', 'css/main.css', 'css/layout.css', 'css/components.css',
  'css/dashboard.css', 'css/devices.css', 'css/responsive.css',
  'js/utils.js', 'js/storage.js', 'js/state.js', 'js/simulation.js', 'js/charts.js',
  'js/theme.js', 'js/app.js', 'js/devices.js', 'js/device-details.js',
  'js/traffic.js', 'js/usage.js', 'js/alerts.js', 'js/settings.js',
  'data/devices.json', 'manifest.webmanifest'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
});
