<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const users = ref();

async function loadUsers() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");

  if (!response.ok) {
    throw new Error("Failed to fetch.");
  }

  const responseUsers = await response.json();

  users.value = responseUsers.sort((a, b) => a.name.localeCompare(b.name));
}

onMounted(async () => {
  await loadUsers();
});
</script>
