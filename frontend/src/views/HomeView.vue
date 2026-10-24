<script setup>
import PageHero from '../components/PageHero.vue';
import { auth } from '../auth.js';

const features = [
  { title: 'Pantau kedaluwarsa', text: 'Badge otomatis menandai produk yang masih aman, hampir habis masa pakainya, atau sudah kedaluwarsa.' },
  { title: 'Jurnal kulit harian', text: 'Catat produk yang dipakai pagi dan malam, kondisi kulit, serta nilai 1 sampai 5.' },
  { title: 'Ringkasan koleksi', text: 'Lihat sekilas jumlah produk, yang segera kedaluwarsa, dan total catatan jurnal.' },
];
</script>

<template>
  <PageHero
    title="Skincare Routine & Inventory Tracker"
    subtitle="Catat koleksi skincare-mu, pantau tanggal kedaluwarsa, dan tulis jurnal kondisi kulit harian."
  />

  <div class="container page">
    <section aria-labelledby="fitur-heading">
      <h2 id="fitur-heading">Yang bisa kamu lakukan</h2>
      <ul class="features">
        <li v-for="item in features" :key="item.title" class="feature">
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </li>
      </ul>
    </section>

    <div class="cta">
      <RouterLink v-if="auth.user" class="btn btn--primary" to="/produk">Buka koleksi produk</RouterLink>
      <RouterLink v-else class="btn btn--primary" to="/auth/login">Masuk untuk mulai</RouterLink>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 1rem;
}
.features {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
.feature {
  display: grid;
  gap: 0.4rem;
  padding: 1.1rem 1.25rem;
  background: var(--white);
  border: 1px solid var(--pink-200);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.cta {
  text-align: center;
}
</style>
