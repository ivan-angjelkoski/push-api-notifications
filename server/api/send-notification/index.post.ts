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
    if (!subscription.endpoint) return;

    promises.push(
      webpush
        .sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              auth: subscription.keys!.auth,
              p256dh: subscription.keys!.p256dh,
            },
          },
          JSON.stringify(notificationPayload)
        )
        .catch((error) => {
          console.error("Error sending notification:", error);
          // Handle errors, e.g., remove invalid subscriptions
        })
    );
  });

  await Promise.all(promises);

  return { message: "Notifications sent to all subscribers." };
});
