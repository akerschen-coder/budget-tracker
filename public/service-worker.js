const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/manifest.json',
    '/styles.css',
    '/index.js',
    'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
    '/indexedDB.js'
];

const PRECACHE = 'precache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

//install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(PRECACHE)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
            .then(self.skipWaiting())
    );
});

//fetch
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api/')) {

        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(function (cache) {
                return fetch(event.request).then(res => {
                    if (res.status === 200) {
                        cache.put(event.request.url, res.clone());
                    }
                    return res
                }).catch(err => {
                    return cache.match(event.request);
                });
            }).catch(err => console.log(err))
        );
        return;
    }

    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request).then(function (res) {
                if (res) {
                    return res;
                } else if (event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('/');
                }
            });
        })
    );
});