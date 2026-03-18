const CACHE_NAME = "aktas-homepage-v2"; // Increment this (v2, v3) to force an update

// 1. Updated file list to match your actual HTML paths
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/css/index.css",
  "/css/search.css",
  "/css/nav.css",
  "/js/style.js",
  "/js/nav.js",
  "/js/search.js",
  "/js/index.js"
];

// Install: Cache the essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting(); // Forces the waiting service worker to become active
});

// Activate: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// Fetch: Network First Strategy
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If network is successful, update the cache and return response
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => {
        // If network fails (offline), try the cache
        return caches.match(event.request);
      })
  );
});