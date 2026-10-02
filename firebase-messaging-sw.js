/* CareerVocab unified PWA + Firebase Cloud Messaging service worker */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCe1C3g41KruW6oeTM7XVLQHKeYgNLjDEY",
  authDomain: "careervocab-e34ba.firebaseapp.com",
  projectId: "careervocab-e34ba",
  storageBucket: "careervocab-e34ba.firebasestorage.app",
  messagingSenderId: "639561561365",
  appId: "1:639561561365:web:44bfbd1d44c097263d6f24"
};

const CACHE = 'careervocab-pwa-v2';
const BASE = new URL('./', self.location.href);
const APP_SHELL = [
  new URL('./', self.location.href).href,
  new URL('./index.html', self.location.href).href,
  new URL('./manifest.json', self.location.href).href,
  new URL('./icon-192.png', self.location.href).href,
  new URL('./icon-512.png', self.location.href).href
];

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage(payload => {
    const n = payload.notification || payload.data || {};
    const title = n.title || 'CareerVocab';
    const options = {
      body: n.body || '',
      icon: new URL('./icon-192.png', self.registration.scope).href,
      badge: new URL('./icon-192.png', self.registration.scope).href,
      data: { url: n.url || n.link || new URL('./', self.registration.scope).href }
    };
    self.registration.showNotification(title, options);
  });
} catch (e) {
  console.error('CareerVocab FCM SW init failed', e);
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(err => { console.warn('CareerVocab cache install warning', err); return self.skipWaiting(); })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(new URL('./', self.location.href).pathname)) return;

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => caches.match(new URL('./index.html', self.location.href))))
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = event.notification?.data?.url || new URL('./', self.registration.scope).href;
  event.waitUntil(clients.matchAll({type:'window', includeUncontrolled:true}).then(list => {
    for (const c of list) {
      if ('focus' in c) {
        if ('navigate' in c) c.navigate(target);
        return c.focus();
      }
    }
    return clients.openWindow(target);
  }));
});
