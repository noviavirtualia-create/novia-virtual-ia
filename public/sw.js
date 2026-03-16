// Service Worker Maestro - Novia Virtual IA (Notificaciones + Caché)
/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'novia-virtual-ia-v1';

// 1. Lógica de Instalación y Caché (Carga rápida)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/novia-virtual-ia/',
        '/novia-virtual-ia/index.html',
        '/novia-virtual-ia/manifest.webmanifest',
        '/novia-virtual-ia/logo.svg'
      ]).catch(err => console.log('Error caching initial assets:', err));
    })
  );
  self.skipWaiting();
});

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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Solo cachear peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        // No cachear recursos externos o fallidos
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse;
        }
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return fetchResponse;
      });
    }).catch(() => {
      // Fallback para navegación si no hay red
      if (event.request.mode === 'navigate') {
        return caches.match('/novia-virtual-ia/index.html');
      }
    })
  );
});

// 2. Lógica de Notificaciones Push
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Tienes una nueva notificación en Novia Virtual IA',
      icon: '/novia-virtual-ia/logo.svg', 
      badge: '/novia-virtual-ia/logo.svg',
      data: {
        url: data.url || '/novia-virtual-ia/'
      },
      actions: [
        { action: 'open', title: 'Ver ahora' },
        { action: 'close', title: 'Cerrar' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Novia Virtual IA', options)
    );
  } catch (error) {
    console.error('Error al procesar notificación push:', error);
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('Novia Virtual IA', {
        body: text,
        icon: '/novia-virtual-ia/logo.svg'
      })
    );
  }
});

// 3. Lógica al hacer clic en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') return;

  const urlToOpen = event.notification.data.url || '/novia-virtual-ia/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
