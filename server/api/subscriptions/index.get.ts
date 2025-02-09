export default defineEventHandler(async () => {
  const subscriptionsStorage = useStorage("cache:subscriptions");

  const subscriptions = await subscriptionsStorage.getKeys();

  return { subscriptions };
});
