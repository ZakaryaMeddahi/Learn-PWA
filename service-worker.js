// This File Should Be In The Root Directory

const staticCache = 'static-cache-v1';
const dynamicCache = 'dynamic-cache-v1';

const staticAssets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/style/style.css',
  '/pages/fallback.html',
];

const limitCacheSize = async (name, size) => {
  try {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    let keysLength = keys.length;
    while (keysLength > size) {
      await cache.delete(keys[0]);
      keysLength--;
    }
  } catch (error) {
    console.error(error);
  }
};

// Install Service Wroker
self.addEventListener('install', async (event) => {
  console.log('Service Worker Installed');
  const preCache = async () => {
    try {
      const cache = await caches.open(staticCache);
      console.log('Caching Shell Assets');
      return cache.addAll(staticAssets);
      // Will Be Stored As Key:Value
      // Key Represent Request
      // Value Represent Response
    } catch (error) {
      console.error(error);
    }
  };

  event.waitUntil(preCache());
  //     ^^^^^^ Wait For The Caching Operation To Complete
  // Before The Browser Close The Service Worker
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker Activated');
  const reomveOldKeys = async () => {
    try {
      const keys = await caches.keys();
      // Iterate Over Keys And Remove All Old Caches
      return Promise.all(
        keys
          .filter((key) => key !== staticCache && key !== dynamicCache)
          .map((key) => caches.delete(key))
      );
      // Note Promise.all Should Be Used When We Have
      // An Array Of Promises
    } catch (error) {
      console.error(error);
    }
  };
  event.waitUntil(reomveOldKeys());
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  console.log('Fetch Event', event);
  let response;
  const fetchAssets = async () => {
    try {
      const cacheResponse = await caches.match(event.request);
      if (!cacheResponse) {
        response = await fetch(event.request);
        const cache = await caches.open(dynamicCache);
        cache.put(event.request.url, response.clone());
        return response;
      }
      return cacheResponse;
    } catch (error) {
      console.error(error);
      return caches.match('/pages/fallback.html');
    } finally {
      limitCacheSize(dynamicCache, 20);
    }
  };

  event.respondWith(fetchAssets());
});

// NOTE: The Service Worker Will Be Installed
// And Activated Only If The The Code Chnaged In This File
