// سرویس‌ورکر ساده برای کش کردن اپ تا بعد از نصب، آفلاین هم باز بشه.
// نسخه رو عوض کن (v1 -> v2) هر بار که فایل‌ها رو آپدیت کردی، وگرنه کاربرهایی
// که قبلاً نصبش کردن نسخه‌ی قدیمی رو از کش می‌بینن.
const CACHE = 'tenex-v1';
const ASSETS = ['./study-tracker.html', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png',
  './icons/maskable-192.png', './icons/maskable-512.png'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=> Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(cached=> cached || fetch(e.request).then(res=>{
      const copy = res.clone();
      caches.open(CACHE).then(c=> c.put(e.request, copy));
      return res;
    }).catch(()=> cached))
  );
});
