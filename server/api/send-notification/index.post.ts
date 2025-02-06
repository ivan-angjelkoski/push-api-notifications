import webpush from "web-push";

export default defineEventHandler(async (event) => {
  const notificationPayload = {
    title: "Nuxt Push Notification Demo",
    body: "This is a push notification from your Nuxt server!",
    icon: "/ivan-angjelkoski.jpeg",
  };

  console.log("Sending notification to all subscribers");

  const promises: unknown[] = [];
  subscriptions.forEach((subscription) => {
    promises.push(
      webpush
        .sendNotification(subscription, JSON.stringify(notificationPayload))
        .catch((error) => {
          console.error("Error sending notification:", error);
          // Handle errors, e.g., remove invalid subscriptions
        })
    );
  });

  await Promise.all(promises);

  return { message: "Notifications sent to all subscribers." };
});
