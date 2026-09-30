/* CareerVocab Firebase Messaging Service Worker
   Firebase configuration is intentionally disabled until project credentials are added.
*/
self.addEventListener("push", event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}
  const n = data.notification || data;
  if (!n || (!n.title && !n.body)) return;
  event.waitUntil(
    self.registration.showNotification(n.title || "CareerVocab", {
      body: n.body || "",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: n.data || {}
    })
  );
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(clients.matchAll({type:"window", includeUncontrolled:true}).then(list => {
    for (const c of list) if ("focus" in c) return c.focus();
    return clients.openWindow("/");
  }));
});
