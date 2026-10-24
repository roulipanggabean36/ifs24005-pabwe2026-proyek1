<script setup>
import AppHeader from './components/AppHeader.vue';
</script>

<template>
  <a class="skip-link" href="#konten">Lewati ke konten utama</a>
  <AppHeader />

  <main id="konten" tabindex="-1">
    <RouterView />
  </main>
</template>

<style scoped>
main:focus {
  outline: none;
}
</style>
