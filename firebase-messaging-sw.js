/* CareerVocab Firebase Cloud Messaging service worker */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCe1C3g41KruW6oeTM7XVLQHKeYgNLjDEY',
  authDomain: 'careervocab-e34ba.firebaseapp.com',
  projectId: 'careervocab-e34ba',
  storageBucket: 'careervocab-e34ba.firebasestorage.app',
  messagingSenderId: '639561561365',
  appId: '1:639561561365:web:44bfbd1d44c097263d6f24'
});

const messaging = firebase.messaging();
const CACHE = 'careervocab-runtime-v3';

messaging.onBackgroundMessage(payload => {
  const n = payload.notification || payload.data || {};
  const title = n.title || 'CareerVocab';
  const options = {
    body: n.body || '',
    icon: new URL('./icon-192.png', self.registration.scope).href,
    badge: new URL('./icon-192.png', self.registration.scope).href,
    data: { url: n.url || n.link || new URL('./', self.registration.scope).href }
  };
  return self.registration.showNotification(title, options);
});

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  if(event.request.method!=='GET') return;
  const u=new URL(event.request.url);
  const base=new URL('./',self.location.href).pathname;
  if(u.origin!==self.location.origin || !u.pathname.startsWith(base)) return;
  event.respondWith(
    caches.match(event.request).then(cached=>cached || fetch(event.request).then(res=>{
      if(res.ok) caches.open(CACHE).then(c=>c.put(event.request,res.clone())).catch(()=>{});
      return res;
    }).catch(()=>caches.match(new URL('./index.html',self.location.href))))
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target=event.notification?.data?.url || new URL('./',self.registration.scope).href;
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const c of list){ if('focus' in c){ if('navigate' in c) c.navigate(target); return c.focus(); } }
    return clients.openWindow(target);
  }));
});
