<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import './assets/css/main.css'
import { RouterView } from 'vue-router';
</script>

<template>
  <NavBar />
  <RouterView />
</template>

<style>

#app {
  background-color: oklch(17% 0.034 264.665);
  min-height: 100%;
}

</style>
