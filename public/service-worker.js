// public/service-worker.js

console.log("Service Worker Registered");

self.addEventListener("push", (event) => {
  const notificationData = event.data.json();

  const title = notificationData.title || "Default Title";
  const options = {
    body: notificationData.body || "Default Message",
    icon: notificationData.icon || "/ivan-angjelkoski.jpeg",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked");
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
