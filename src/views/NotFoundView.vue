<script setup>
import PageHero from '../components/PageHero.vue';
</script>

<template>
  <PageHero title="Halaman tidak ditemukan" subtitle="Alamat yang kamu buka tidak ada di aplikasi ini." />
  <div class="container page">
    <p class="empty">Coba kembali ke beranda atau pilih menu di bagian atas.</p>
    <p><RouterLink class="btn btn--primary" to="/">Kembali ke beranda</RouterLink></p>
  </div>
</template>
