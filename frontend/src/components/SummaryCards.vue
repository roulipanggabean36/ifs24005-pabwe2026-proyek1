<script setup>
import { computed } from 'vue';

const props = defineProps({
  stats: { type: Object, required: true },
});

const items = computed(() => [
  { label: 'Total produk', value: props.stats.totalProducts, tone: 'pink' },
  { label: 'Segera kedaluwarsa (30 hari)', value: props.stats.expiringSoon, tone: 'peach' },
  { label: 'Sudah kedaluwarsa', value: props.stats.expired, tone: 'rose' },
  { label: 'Catatan jurnal', value: props.stats.totalEntries, tone: 'lilac' },
]);
</script>

<template>
  <ul class="summary" aria-label="Ringkasan koleksi">
    <li v-for="item in items" :key="item.label" class="stat" :class="`stat--${item.tone}`">
      <span class="value">{{ item.value }}</span>
      <span class="label">{{ item.label }}</span>
    </li>
  </ul>
</template>

<style scoped>
.summary {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
}
.stat {
  display: grid;
  gap: 0.15rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius);
  border: 1px solid var(--white);
  box-shadow: var(--shadow);
  color: var(--plum-900);
}
.stat--pink {
  background: var(--pink-100);
}
.stat--peach {
  background: var(--peach-100);
}
.stat--rose {
  background: var(--pink-200);
}
.stat--lilac {
  background: var(--lilac-100);
}
.value {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}
.label {
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
