const CACHE = "careervocab-pwa-v3";
const APP_BASE = new URL("./", self.registration.scope).href;
const APP_SHELL = [
  APP_BASE,
  new URL("index.html", APP_BASE).href,
  new URL("manifest.json", APP_BASE).href,
  new URL("icon-192.png", APP_BASE).href,
  new URL("icon-512.png", APP_BASE).href
];

// Firebase Cloud Messaging is intentionally integrated into the SAME root
// service worker as the PWA. Two service workers cannot safely share the
// same scope, which can cause PushManager / FCM getToken registration errors.
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyCe1C3g41KruW6oeTM7XVLQHKeYgNLjDEY",
  authDomain: "careervocab-e34ba.firebaseapp.com",
  projectId: "careervocab-e34ba",
  storageBucket: "careervocab-e34ba.firebasestorage.app",
  messagingSenderId: "639561561365",
  appId: "1:639561561365:web:44bfbd1d44c097263d6f24"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage(payload => {
    const n = payload.notification || payload.data || {};
    const title = n.title || "CareerVocab";
    const options = {
      body: n.body || "",
      icon: new URL("./icon-192.png", self.registration.scope).href,
      badge: new URL("./icon-192.png", self.registration.scope).href,
      data: { url: n.url || n.link || new URL("./", self.registration.scope).href }
    };
    self.registration.showNotification(title, options);
  });
} catch (e) {
  console.error("CareerVocab FCM SW init failed", e);
}

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = event.notification?.data?.url || new URL("./", self.registration.scope).href;
  event.waitUntil(clients.matchAll({type:"window", includeUncontrolled:true}).then(list => {
    for (const c of list) {
      if ("focus" in c) {
        if ("navigate" in c) c.navigate(target);
        return c.focus();
      }
    }
    return clients.openWindow(target);
  }));
});

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res.ok && new URL(req.url).origin === self.location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(new URL("index.html", APP_BASE).href));
    })
  );
});
