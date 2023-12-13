<template>
  <div>
    <div class="message">
      {{ formMessage }}
    </div>
    <form class="newsletter-subscription" v-if="!subscribeSucceeded">
      <div>
        <label for="first-name">First Name</label>
        <input type="text" id="first-name" v-model="firstName" />
        <div v-if="errors.has('firstName')">
          {{ errors.get("firstName") }}
        </div>
      </div>
      <div>
        <label for="email">Email</label>
        <input type="text" id="email" v-model="email" />
        <div v-if="errors.has('email')">{{ errors.get("email") }}</div>
      </div>
      <button type="submit" :disabled="submitting" @click.prevent="submitForm">
        Subscribe
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const firstName = ref("");
const email = ref("");
const submitting = ref(false);
const subscribeSucceeded = ref(false);
const errors = ref(new Map());
const formMessage = ref("");

watch([firstName, email], () => {
  formMessage.value = "";
});

async function validateForm() {
  const newErrors = new Map();

  if (firstName.value.length === 0) {
    newErrors.set("firstName", "First name is required");
  }

  if (email.value.length === 0) {
    newErrors.set("email", "Email is required");
  }

  if (email.value.length > 0 && !email.value.includes("@")) {
    newErrors.set("email", "Email is invalid");
  }

  errors.value = newErrors;
}

async function submitForm() {
  await validateForm();

  if (errors.value.size > 0) {
    return;
  }

  submitting.value = true;

  const url = new URL("/api/newsletter", window.location.origin);
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      firstName: firstName.value,
      email: email.value,
    }),
  });

  submitting.value = false;
  subscribeSucceeded.value = response.ok;
  formMessage.value = response.ok
    ? "Thank you for subscribing!"
    : "Something went wrong. Please try again.";
}
</script>

<style scoped>
.message {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
</style>
