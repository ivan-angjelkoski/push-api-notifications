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

    await $fetch("/api/subscriptions", {
      method: "POST",
      body: subscription.toJSON(),
    });

    console.log("Subscription sent to server.");

    isSubscribed.value = true;

    refresh();
  } catch (error) {
    console.error("Error during subscription:", error);
  }
}

const { data: subscribers, refresh } = useFetch("/api/subscriptions");
</script>

<template>
  <div>
    <div class="max-w-6xl mx-auto w-full p-4">
      <div class="flex justify-center items-center gap-4">
        <img
          src="/injective-ui.png"
          class="w-10 h-10"
        />
        <h2 class="text-5xl font-bold">Injective</h2>
      </div>

      <h1 class="text-3xl font-bold text-center mt-4">📨 Push Notifications</h1>

      <div class="grid grid-cols-1 gap-4">
        <UCard class="mt-10">
          <SendNotificationForm />
        </UCard>

        <UCard>
          <h3 class="text-2xl font-bold mb-4">
            Subscribers: {{ subscribers?.subscriptions.length || 0 }}
          </h3>

          <div>
            <UButton
              id="subscribeButton"
              color="info"
              icon="i-heroicons-bell"
              :disabled="isSubscribed"
              @click="subscribeUser"
            >
              {{ isSubscribed ? "Subscribed!" : "Enable Push Notifications" }}
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
