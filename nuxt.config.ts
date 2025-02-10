// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxt/eslint"],

  runtimeConfig: {
    vapidPrivateKey: "",
    public: {
      vapidPublicKey: "",
    },
  },

  nitro: {
    storage: {
      vercel_kv: {
        driver: "upstash",
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
        ttl: 60 * 60 * 24 * 7 * 4,
      },
    },
  },

  css: ["~/assets/css/main.css"],

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-11-27",
});
