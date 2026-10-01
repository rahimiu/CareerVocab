/* CareerVocab Firebase Cloud Messaging service worker */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCe1C3g41kRuW6oeTM7XVLQHKeYgNLjDEY",
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
    const title = n.title || 'CareerVocab';
    const options = {
      body: n.body || '',
      icon: new URL('./icon-192.png', self.registration.scope).href,
      badge: new URL('./icon-192.png', self.registration.scope).href,
      data: {
        url: n.url || n.link || new URL('./', self.registration.scope).href
      }
    };
    self.registration.showNotification(title, options);
  });
} catch (e) {
  console.error('CareerVocab FCM SW init failed', e);
}

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
