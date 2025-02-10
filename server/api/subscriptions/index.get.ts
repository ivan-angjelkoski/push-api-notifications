export default defineEventHandler(async () => {
  const subscriptionsStorage = useStorage("vercel_kv:subscriptions");

  const subscriptions = await subscriptionsStorage.getKeys();

  return { subscriptions };
});
