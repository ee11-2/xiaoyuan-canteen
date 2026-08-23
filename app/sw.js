/* Service Worker for 呆呆大王的食堂小馆 · Dot Dot Café
 * V2 液态玻璃版本 — 升级缓存策略：network-first，安装时清理所有旧缓存，防止旧页面一直显示
 */
const CACHE = 'dotdotcafe-app-v20260823-liquidglass-v2';

self.addEventListener('install', e => {
  e.waitUntil(
    // 安装时立即清理所有历史旧缓存（包括之前所有 peach / dotdot 版本）
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== CACHE)
        .map(k => caches.delete(k))
      )
    ).then(() => {
      // 预缓存核心资源
      return caches.open(CACHE).then(c =>
        c.addAll([
          './',
          './index.html',
          './manifest.webmanifest',
          './sw.js',
          './data/menu.json'
        ]).catch(() => {})
      );
    })
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

// Network-first 策略：优先获取网络最新版本，失败才回退缓存
// 防止 PWA / Service Worker 一直显示旧版本
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // 只拦截同源请求
  if (url.origin !== self.location.origin) return;

  // HTML 页面：强制 network-first
  if (req.mode === 'navigate' ||
      (req.destination === 'document' && url.pathname.endsWith('.html')) ||
      url.pathname.endsWith('/')) {
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

  // 其他资源：stale-while-revalidate
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

// 收到 skipWaiting 消息立即激活
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING' || e.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
