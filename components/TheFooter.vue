<template>
  <footer class="footer">
    <div class="container">
      <form class="newsletter-subscription" v-if="!subscribeSucceeded">
        <div>
          <label for="first-name">First Name</label>
          <input type="text" id="first-name" v-model="firstName" />
          <div v-if="firstName.length === 0">First name is required</div>
        </div>
        <div>
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email" />
          <div v-if="email.length === 0">Email is required</div>
          <div v-else-if="!email.includes('@')">Email is invalid</div>
        </div>
        <button type="submit" @click.prevent="submitForm">Subscribe</button>
      </form>
      <div v-else>
        <div class="message">Thank you for subscribing!</div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from "vue";

const firstName = ref("");
const email = ref("");
const subscribeSucceeded = ref(false);

async function submitForm() {
  if (
    firstName.value.length === 0 ||
    email.value.length === 0 ||
    !email.value.includes("@")
  ) {
    return;
  }

  const url = new URL("/api/newsletter", window.location.origin);
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      firstName: firstName.value,
      email: email.value,
    }),
  });

  subscribeSucceeded.value = response.ok;
}
</script>

<style scoped>
.footer {
  position: relative;
  z-index: var(--vp-z-index-footer);
  border-top: 1px solid var(--vp-c-gutter);
  padding: 32px 24px;
  background-color: var(--vp-c-bg);
}

.footer :deep(a) {
  text-decoration-line: underline;
  text-underline-offset: 2px;
  transition: color 0.25s;
}

.footer :deep(a:hover) {
  color: var(--vp-c-text-1);
}

@media (min-width: 768px) {
  .footer {
    padding: 32px;
  }
}

.container {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  text-align: center;
}

.message,
.copyright {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
</style>
