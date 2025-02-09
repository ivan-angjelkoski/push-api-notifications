export default defineEventHandler(async (event) => {
  const subscriptionsStorage = useStorage("cache:subscriptions");

  const subscription = (await readBody(event)) as PushSubscription;

  await subscriptionsStorage.setItem(subscription.endpoint, subscription);
  const subscriptionFromStorage = await subscriptionsStorage.get(
    subscription.endpoint
  );

  console.log(subscriptionFromStorage);

  return { subscriptionFromStorage };

  console.log(subscription);

  if (!subscription) {
    return { message: "No subscription provided." };
  }

  subscriptions.push(subscription);
  console.log("New subscription added:", subscription);

  return { message: "Subscription added successfully." };
});
