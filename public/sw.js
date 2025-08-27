// Service Worker for Rural Harvest Marketplace
// Provides caching, offline functionality, and performance improvements

const CACHE_NAME = 'super-mall-v1.0.0';
const urlsToCache = [
  '/',
  '/offline',
  '/images/placeholder.jpg',
  '/_next/static/css/',
  '/_next/static/js/',
  '/images/logo.png',
];

// Cache-first strategy for static assets
const cacheFirst = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('Cache-first failed:', error);
    throw error;
  }
};

// Network-first strategy for API calls
const networkFirst = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
};

// Stale-while-revalidate strategy
const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  return cached || fetchPromise;
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching static assets');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different types of requests
  if (request.method !== 'GET') {
    return; // Only cache GET requests
  }
  
  // API requests - network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      networkFirst(request).catch(() => {
        // Return offline page for failed API requests
        return caches.match('/offline');
      })
    );
    return;
  }
  
  // Static assets - cache first
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.includes('.css') ||
    url.pathname.includes('.js') ||
    url.pathname.includes('.woff') ||
    url.pathname.includes('.woff2')
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Pages - stale while revalidate
  if (url.pathname.startsWith('/') && request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      staleWhileRevalidate(request).catch(() => {
        return caches.match('/offline');
      })
    );
    return;
  }
  
  // Cache images with a fallback strategy
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(event.request).catch(() => {
            // Return placeholder image if fetch fails
            return caches.match('/images/placeholder.jpg')
              .then(response => response || new Response(null, { status: 404 }));
          });
        })
    );
    return;
  }
  
  // Default - network with cache fallback
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle offline actions when back online
      handleBackgroundSync()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from Rural Harvest',
    icon: '/images/logo.png',
    badge: '/images/badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Rural Harvest', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(event.data.payload);
      })
    );
  }
});

// Utility functions
async function handleBackgroundSync() {
  try {
    // Sync offline cart items
    const cartItems = await getOfflineCartItems();
    if (cartItems.length > 0) {
      await syncCartItems(cartItems);
    }
    
    // Sync offline wishlist items
    const wishlistItems = await getOfflineWishlistItems();
    if (wishlistItems.length > 0) {
      await syncWishlistItems(wishlistItems);
    }
    
    console.log('Service Worker: Background sync completed');
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

async function getOfflineCartItems() {
  // Implementation to get offline cart items from IndexedDB
  return [];
}

async function syncCartItems(items) {
  // Implementation to sync cart items with server
  for (const item of items) {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
    } catch (error) {
      console.error('Failed to sync cart item:', error);
    }
  }
}

async function getOfflineWishlistItems() {
  // Implementation to get offline wishlist items from IndexedDB
  return [];
}

async function syncWishlistItems(items) {
  // Implementation to sync wishlist items with server
  for (const item of items) {
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
    } catch (error) {
      console.error('Failed to sync wishlist item:', error);
    }
  }
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});

console.log('Service Worker: Script loaded successfully');