import webpush from "web-push";
import z from "zod";
import type { H3Event } from "h3";

const schema = z.object({
  title: z.string(),
  body: z.string(),
});

async function getTitleAndBody(event: H3Event) {
  try {
    const { title, body } = await readValidatedBody(event, schema.parse);
    return { title, body };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    const { title, body } = await getValidatedQuery(event, schema.parse);
    return { title, body };
  }
}

export default defineEventHandler(async (event) => {
  const { title, body } = await getTitleAndBody(event);

  const notificationPayload = {
    title: title || "Nuxt Push Notification Demo",
    body: body || "This is a push notification from your Nuxt server!",
    icon: "/injective-ui.png",
  };

  console.log("Sending notification to all subscribers");

  const subscriptionsStorage = useStorage<PushSubscriptionJSON>(
    "cache:subscriptions"
  );

  const keys = await subscriptionsStorage.getKeys();

  const subscriptions = await Promise.all(
    keys.map(async (key) => {
      if (!key) return null;

      return await subscriptionsStorage.getItem(key);
    })
  );

  console.log("Subscribers:", subscriptions.length);

  const promises: unknown[] = [];

  subscriptions.forEach((subscription) => {
    if (!subscription?.endpoint) return;

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
          JSON.stringify(notificationPayload),
          {
            urgency: "high",
            TTL: 7 * 24 * 60 * 60 * 1000, // 7 days
          }
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
