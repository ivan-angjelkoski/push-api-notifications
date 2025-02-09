<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  title: undefined,
  body: undefined,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { title, body } = event.data;

  await $fetch("/api/send-notification", {
    method: "POST",
    body: {
      title,
      body,
    },
  });

  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Title"
      name="title"
      size="xl"
    >
      <UInput
        v-model="state.title"
        class="w-full"
        icon="i-heroicons-information-circle"
      />
    </UFormField>

    <UFormField
      label="Body"
      name="body"
      size="xl"
    >
      <UInput
        v-model="state.body"
        class="w-full"
        icon="i-heroicons-chat-bubble-bottom-center-text"
      />
    </UFormField>

    <UButton
      block
      type="submit"
      color="neutral"
      icon="i-heroicons-paper-airplane"
      >Submit</UButton
    >
  </UForm>
</template>
