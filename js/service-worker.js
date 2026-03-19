const CACHE_NAME = "aktas-homepage-v3"; // Increment this (v2, v3) to force an update
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

// ── Stream transfer support ──────────────────────────────────────────────────
// Map of transferId -> { controller, stream, filename, size }
const streamMap = new Map();

self.addEventListener("message", (event) => {
  const { type, id, filename, size, chunk } = event.data;
  if (type === "STREAM_CREATE") {
    let controller;
    const stream = new ReadableStream({
      start(c) { controller = c; },
      cancel() { streamMap.delete(id); }
    });
    streamMap.set(id, { controller, stream, filename, size });
    // Confirm to page so it knows when to trigger the download link
    event.source && event.source.postMessage({ type: "STREAM_READY", id });
  } else if (type === "STREAM_CHUNK") {
    const entry = streamMap.get(id);
    if (entry) entry.controller.enqueue(new Uint8Array(chunk));
  } else if (type === "STREAM_END") {
    const entry = streamMap.get(id);
    if (entry) { entry.controller.close(); streamMap.delete(id); }
  }
});
// ────────────────────────────────────────────────────────────────────────────

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
// Fetch: intercept /sw-transfer/* for streaming downloads, then Network First
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // ── Streaming download intercept ─────────────────────────────────────────
  if (url.pathname.startsWith("/sw-transfer/")) {
    const id = url.pathname.replace("/sw-transfer/", "");
    const entry = streamMap.get(id);
    if (entry) {
      event.respondWith(new Response(entry.stream, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${entry.filename}"`,
          ...(entry.size ? { "Content-Length": String(entry.size) } : {})
        }
      }));
      return;
    }
  }
  // ─────────────────────────────────────────────────────────────────────────

  // Network First Strategy (existing)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});