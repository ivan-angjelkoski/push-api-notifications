import webpush from "web-push";

export default defineNitroPlugin(async (nitroApp) => {
  const runtimeConfig = useRuntimeConfig();

  webpush.setVapidDetails(
    "mailto:example@gmail.com",
    runtimeConfig.public.vapidPublicKey,
    runtimeConfig.vapidPrivateKey
  );
});
