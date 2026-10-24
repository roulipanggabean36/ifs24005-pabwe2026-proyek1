<script setup>
import { computed, onMounted } from 'vue';
import PageHero from '../components/PageHero.vue';
import SummaryCards from '../components/SummaryCards.vue';
import ExpiryBadge from '../components/ExpiryBadge.vue';
import NoticeBar from '../components/NoticeBar.vue';
import { collection, getStats, loadAll } from '../collection.js';
import { CATEGORY_LABELS, formatDate } from '../utils/format.js';

onMounted(loadAll);

const stats = computed(() => getStats());
const urgent = computed(() =>
  collection.products
    .filter((p) => p.days_left <= 30)
    .sort((a, b) => a.days_left - b.days_left)
);
</script>

<template>
  <PageHero title="Ringkasan" subtitle="Gambaran singkat koleksi skincare dan jurnal kulitmu." />

  <div class="container page">
    <NoticeBar />
    <SummaryCards :stats="stats" />

    <section aria-labelledby="urgent-heading">
      <h2 id="urgent-heading">Perlu segera dipakai</h2>
      <p v-if="collection.loading" class="empty" role="status">Memuat data…</p>
      <p v-else-if="!urgent.length" class="empty">Tidak ada produk yang mendekati kedaluwarsa. ✿</p>
      <ul v-else class="list">
        <li v-for="product in urgent" :key="product.id" class="item">
          <div>
            <p class="name">{{ product.name }}</p>
            <p class="sub">
              {{ product.brand }} · {{ CATEGORY_LABELS[product.category] || product.category }} · sampai
              {{ formatDate(product.expiry_date) }}
            </p>
          </div>
          <ExpiryBadge :days-left="product.days_left" />
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 1rem;
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem 1rem;
  flex-wrap: wrap;
  padding: 0.9rem 1.1rem;
  background: var(--white);
  border: 1px solid var(--pink-200);
  border-radius: var(--radius);
}
.name {
  font-weight: 600;
}
.sub {
  font-size: 0.875rem;
  color: var(--plum-700);
}
</style>
