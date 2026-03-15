const CACHE_NAME = 'cococount-v1';
const FILES = [
  './',
  './index.html',
  './model.json',
  './group1-shard1of3.bin',
  './group1-shard2of3.bin',
  './group1-shard3of3.bin',
  './metadata.yaml',
  'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;600;700&display=swap'
];

// Instala e guarda todos os arquivos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Guardando arquivos no cache...');
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting();
});

// Ativa e remove caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Intercepta requisições — serve do cache primeiro
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => cached);
    })
  );
});
