<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Profile from './views/Auth.vue'
</script>

<template>
  <div class="container">
    <a href="https://vitejs.dev" target="_blank">
      <img src="./assets/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
      <div class="row flex flex-center">
        <RouterLink to="/profile"> Profile </RouterLink>
        <RouterLink to="/"> Home </RouterLink>
      </div>
  </div>
  <RouterView />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
