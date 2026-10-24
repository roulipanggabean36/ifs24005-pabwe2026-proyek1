<script setup>
import { computed, ref } from 'vue';
import ProductCard from './ProductCard.vue';
import { CATEGORY_LABELS } from '../utils/format.js';

const props = defineProps({
  products: { type: Array, required: true },
  loading: { type: Boolean, default: false },
});
defineEmits(['add', 'edit', 'remove']);

const search = ref('');
const category = ref('');
const onlySoon = ref(false);

const filtered = computed(() => {
  const keyword = search.value.trim().toLowerCase();
  return props.products.filter((p) => {
    const matchText = !keyword || `${p.name} ${p.brand}`.toLowerCase().includes(keyword);
    const matchCategory = !category.value || p.category === category.value;
    const matchSoon = !onlySoon.value || p.days_left <= 30;
    return matchText && matchCategory && matchSoon;
  });
});
</script>

<template>
  <section aria-labelledby="products-heading">
    <div class="head">
      <h2 id="products-heading">Koleksi Produk</h2>
      <button type="button" class="btn btn--primary" @click="$emit('add')">+ Tambah produk</button>
    </div>

    <form class="filters" role="search" aria-label="Cari dan saring produk" @submit.prevent>
      <div class="field">
        <label for="search">Cari nama atau merek</label>
        <input id="search" v-model="search" class="input" type="search" placeholder="Contoh: Wardah" />
      </div>
      <div class="field">
        <label for="category">Kategori</label>
        <select id="category" v-model="category" class="input">
          <option value="">Semua kategori</option>
          <option v-for="(label, key) in CATEGORY_LABELS" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>
      <label class="check">
        <input v-model="onlySoon" type="checkbox" />
        Hanya yang segera atau sudah kedaluwarsa
      </label>
    </form>

    <p v-if="loading" class="empty" role="status">Sedang memuat produk…</p>
    <p v-else-if="!products.length" class="empty">
      Belum ada produk. Klik “Tambah produk” untuk mulai mencatat koleksimu ✿
    </p>
    <p v-else-if="!filtered.length" class="empty">Tidak ada produk yang cocok dengan pencarianmu.</p>

    <div v-else class="grid">
      <ProductCard
        v-for="product in filtered"
        :key="product.id"
        :product="product"
        @edit="$emit('edit', $event)"
        @remove="$emit('remove', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
/* Cari (lebih lebar) dan Kategori sebaris; kotak centang di baris sendiri supaya teksnya tidak terpotong */
.filters {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 0.9rem 1rem;
  align-items: start;
  padding: 1rem 1.1rem;
  margin-bottom: 1.25rem;
  background: var(--lilac-100);
  border: 1px solid var(--lilac-200);
  border-radius: var(--radius);
}
.check {
  grid-column: 1 / -1;
  display: flex;
  gap: 0.6rem;
  align-items: center;
  font-weight: 500;
  min-height: 44px;
  padding-top: 0.6rem;
  border-top: 1px dotted var(--lilac-200);
}
.check input {
  flex: none;
  width: 1.4rem;
  height: 1.4rem;
  accent-color: var(--rose-700);
}
@media (max-width: 560px) {
  .filters {
    grid-template-columns: minmax(0, 1fr);
  }
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1.25rem;
}
</style>
