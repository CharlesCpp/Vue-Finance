<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';
import { supabase } from './supabase';
import router from './router';

const user = ref(false)

if (supabase.auth.user() != null) {
  user.value = true;
}

</script>

<template>
  <div class="container">
    <a href="https://vitejs.dev" target="_blank">
      <img src="./assets/vite.svg" class="logo" alt="Vite logo" />
    </a>
      <div class="row flex flex-center">
        <RouterLink to="/profile">
        <button v-if="router.currentRoute.value.path == '/' && user" class="ms-auto button"> Profile </button>
        </RouterLink>
        <RouterLink to="/">
        <button v-if="router.currentRoute.value.path == '/profile'" class="ms-auto button"> Home </button>
        </RouterLink>
        <button v-if="user" class="ms-auto button"> Shares </button>
      </div>
  </div>
  <RouterView />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 10px;
  margin-left: 45%;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.button {
  margin: 10px;
}
</style>
