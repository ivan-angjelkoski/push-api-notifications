export default defineEventHandler(async (event) => {
  const subscriptionsStorage = useStorage("cache:subscriptions");

  const subscription = (await readBody(event)) as PushSubscription;

  if (!subscription) {
    return { message: "No subscription provided." };
  }

  await subscriptionsStorage.setItem(subscription.endpoint, subscription);

  return { message: "Subscription added successfully." };
});
