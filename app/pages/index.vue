<script setup lang="ts">
import { ref, onMounted } from "vue";

const isSubscribed = ref(false);

const runtimeConfig = useRuntimeConfig();

onMounted(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/" })
      .then((registration) => {
        console.log(
          "Service Worker Registered with scope:",
          registration.scope
        );
        // Check if already subscribed and update UI if needed (optional, for persistence)
      })
      .catch((error) =>
        console.error("Service Worker registration failed:", error)
      );
  } else {
    console.warn("Service workers are not supported in this browser.");
  }
});

async function subscribeUser() {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service workers are not supported in this browser.");
    return;
  }

  const permissionResult = await Notification.requestPermission();
  if (permissionResult !== "granted") {
    console.log("Permission not granted.");
    return;
  }
  console.log("Permission granted.");

  try {
    const registration = await navigator.serviceWorker.ready; // Ensure service worker is ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: runtimeConfig.public.vapidPublicKey,
    });

    await $fetch("/api/subscribe", {
      method: "POST",
      body: subscription.toJSON(),
    });

    console.log("Subscription sent to server.");

    isSubscribed.value = true;
  } catch (error) {
    console.error("Error during subscription:", error);
  }
}

async function sendNotification() {
  await $fetch("/api/send-notification", {
    method: "POST",
  });
}
</script>

<template>
  <div>
    <h1>Nuxt Push Notification Demo</h1>
    <UButton
      id="subscribeButton"
      :disabled="isSubscribed"
      @click="subscribeUser"
    >
      {{ isSubscribed ? "Subscribed!" : "Enable Push Notifications" }}
    </UButton>

    <UButton @click="sendNotification"> Send Notification </UButton>
  </div>
</template>
