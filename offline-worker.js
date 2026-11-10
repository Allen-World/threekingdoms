/* 兼容旧版本的退役脚本：不下载资源、不拦截请求、不强制刷新游戏。 */
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // 立即替换仍在控制旧页面的资源包 Worker，所有请求恢复浏览器原生行为。
    await self.clients.claim();
    await self.registration.unregister();
    const prefix = `sanguo-offline:${new URL(self.registration.scope).pathname}:`;
    try {
      for (const name of await caches.keys()) {
        if (name.startsWith(prefix)) await caches.delete(name);
      }
    } catch { /* 缓存不可用也不能影响退役和页面。账号与本地存档不在此清理。 */ }
  })());
});
