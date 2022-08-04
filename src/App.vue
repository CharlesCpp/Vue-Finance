<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';
import { supabase } from './supabase';
import router from './router';

</script>

<template>
  <div class="container">
    <a href="https://vitejs.dev" target="_blank">
      <img src="./assets/vite.svg" class="logo" alt="Vite logo" />
    </a>
      <div class="row flex flex-center">

        <RouterLink to="/">
        <button v-if="router.currentRoute.value.path !== '/'" class="ms-auto button"> Home </button>
        </RouterLink>

        <RouterLink to="/profile">
        <button v-if="router.currentRoute.value.path !== '/profile'" class="ms-auto button"> Profile </button>
        </RouterLink>

        <RouterLink to="/buy">
        <button class="ms-auto button"> Purchase </button>
        </RouterLink>
        
        <RouterLink to="/sell">
        <button class="ms-auto button"> Sell </button>
        </RouterLink>
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
button:hover {
  filter: drop-shadow(0 0 0.5em #646cffaa);
}
</style>
