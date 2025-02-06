export default defineEventHandler(async (event) => {
  const subscription = (await readBody(event)) as PushSubscription;

  console.log(subscription);

  if (!subscription) {
    return { message: "No subscription provided." };
  }

  subscriptions.push(subscription);
  console.log("New subscription added:", subscription);

  return { message: "Subscription added successfully." };
});
