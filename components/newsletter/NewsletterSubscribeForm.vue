<template>
  <div class="newsletter-subscription">
    <h3>Stay up to date</h3>
    <p>Subscribe to the newsletter to stay up to date with articles.</p>
    <div v-if="subscribeSucceeded" class="message">
      <p>Thank you for subscribing!</p>
    </div>
    <form v-else>
      <div v-if="globalError" class="error">
        {{ globalError }}
      </div>
      <div class="form-group">
        <label for="first-name">First Name</label>
        <input type="text" id="first-name" v-model="firstName" />
        <div class="error">
          {{ errors.get("firstName") }}
        </div>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="text" id="email" v-model="email" />
        <div class="error">
          {{ errors.get("email") }}
        </div>
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
const globalError = ref("");

watch([firstName, email], () => {
  globalError.value = "";
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

  globalError.value = "";
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

  if (!response.ok) {
    globalError.value = "Something went wrong. Please try again.";
    subscribeSucceeded.value = false;

    return;
  }

  subscribeSucceeded.value = true;
}
</script>

<style scoped>
.newsletter-subscription {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;

  form {
    display: flex;
    flex-direction: column;
    width: 100%;

    @media (min-width: 768px) {
      width: 450px;
    }
  }

  h3 {
    font-size: 24px;
    font-weight: 500;
    color: var(--vp-c-text-1);
  }

  p {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-2);
  }

  .error {
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-red-1);
    text-align: left;
  }

  .form-group {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    width: 100%;

    label {
      font-size: 14px;
      font-weight: 500;
      color: var(--vp-c-text-2);
      text-align: left;
    }

    input {
      margin-top: 2px;
      width: 100%;
      height: 40px;
      border: 1px solid var(--vp-c-border);
      border-radius: 4px;
      padding: 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--vp-c-text-1);
    }
  }

  button {
    margin-top: 16px;
    width: 100%;
    height: 40px;
    border: 1px solid var(--vp-c-border);
    border-radius: 4px;
    background-color: var(--vp-button-brand-active-text);
    color: var(--vp-c-text-1);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
}

.message {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
</style>
