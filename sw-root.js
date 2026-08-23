/* 根 Service Worker for 呆呆大王的食堂小馆 · Dot Dot Café
 * 根作用域 — 防止旧缓存一直卡住
 * V5 极致紧凑移动端版本 — 安装时清理所有历史缓存，HTML 走 network-first
 */
const CACHE = 'dotdotcafe-root-v20260823-ultra-mobile-v6';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== CACHE)
        .map(k => caches.delete(k))
      )
    ).then(() =>
      caches.open(CACHE).then(c =>
        c.addAll([
          './',
          './index.html',
          './manifest.webmanifest',
          './sw.js',
          './app/',
          './app/index.html',
          './app/sw.js',
          './app/manifest.webmanifest',
          './app/data/menu.json'
        ]).catch(() => {})
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== CACHE)
        .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isHtml =
    req.mode === 'navigate' ||
    req.destination === 'document' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('/');

  if (isHtml) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then(h => h || caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => {
      const fetchPromise = fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => hit);
      return hit || fetchPromise;
    })
  );
});

self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING' || e.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
