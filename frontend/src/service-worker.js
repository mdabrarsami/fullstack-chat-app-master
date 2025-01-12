const CACHE_NAME = 'newsm-cache-v1';
const THEME_CACHE_NAME = 'theme-cache-v1';

let currentTheme = {
  color: '#570df8', // Default color
  isDark: false
};

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/icon-192x192.png',
        '/icon-512x512.png'
      ]);
    })
  );
});

// Fetch event - handle offline access
self.addEventListener('fetch', (event) => {
  console.log('Service Worker fetching...', event.request.url);
  if (event.request.url.endsWith('manifest.json')) {
    event.respondWith(
      caches.match('theme').then(async themeResponse => {
        const theme = themeResponse ? 
          await themeResponse.json() : 
          currentTheme;

        return fetch(event.request).then(response => 
          response.json().then(manifest => {
            manifest.theme_color = theme.color;
            manifest.background_color = theme.isDark ? '#000000' : '#ffffff';
            
            return new Response(JSON.stringify(manifest), {
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
              }
            });
          })
        );
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => 
        response || fetch(event.request)
      )
    );
  }
  // event.respondWith(
  //   caches.match(event.request).then((response) => {
  //     return response || fetch(event.request);
  //   })
  // );
});

// Push event - handle notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New Message',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'message',
    data: {
      url: '/' // URL to open when notification is clicked
    },
    actions: [
      {
        action: 'view',
        title: 'View Message'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('NewsM', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'view') {
    // Open the app when notification is clicked
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle subscription change
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('Push subscription changed:', event);
  // Re-subscribe with new subscription
  event.waitUntil(
    self.registration.pushManager.subscribe({ userVisibleOnly: true })
      .then((subscription) => {
        console.log('New subscription:', subscription);
        // Here you would typically send the new subscription to your server
      })
  );
});

// Message event - handle messages from the client
self.addEventListener('message', (event) => {
  console.log('Message received:', event.data);
  if (event.data && event.data.type === 'skipWaiting') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'UPDATE_THEME') {
    currentTheme = {
      color: event.data.theme,
      isDark: event.data.isDark
    };

    // Cache the new theme
    caches.open(THEME_CACHE_NAME).then(cache => {
      cache.put('theme', new Response(JSON.stringify(currentTheme)));
    });

    // Notify all clients about the theme change
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'THEME_UPDATED',
          theme: currentTheme
        });
      });
    });
  }

});