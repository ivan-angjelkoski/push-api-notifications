import webpush from "web-push";

export default defineNitroPlugin(async () => {
  const runtimeConfig = useRuntimeConfig();

  console.log("Nitro Plugin: Setting VAPID Keys");

  webpush.setVapidDetails(
    "mailto:example@gmail.com",
    runtimeConfig.public.vapidPublicKey,
    runtimeConfig.vapidPrivateKey
  );
});
