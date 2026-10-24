<script setup>
import { computed } from 'vue';
import ExpiryBadge from './ExpiryBadge.vue';
import { CATEGORY_LABELS, expiryStatus, formatDate, formatRupiah } from '../utils/format.js';

const props = defineProps({
  product: { type: Object, required: true },
});
defineEmits(['edit', 'remove']);

// Ikon dekoratif per kategori (aria-hidden, nama kategori tetap tertulis di chip)
const CATEGORY_ICONS = {
  cleanser: '🧼',
  toner: '💧',
  serum: '✨',
  moisturizer: '🧴',
  sunscreen: '☀️',
  mask: '🌸',
  other: '🎀',
};

const icon = computed(() => CATEGORY_ICONS[props.product.category] || CATEGORY_ICONS.other);
const tone = computed(() => expiryStatus(props.product.days_left).key);
</script>

<template>
  <article class="card" :class="`card--${tone}`">
    <div class="top">
      <span class="icon" aria-hidden="true">{{ icon }}</span>
      <div class="title">
        <h3>{{ product.name }}</h3>
        <p class="brand">{{ product.brand }}</p>
      </div>
    </div>

    <div class="tags">
      <span class="chip">{{ CATEGORY_LABELS[product.category] || product.category }}</span>
      <ExpiryBadge :days-left="product.days_left" />
    </div>

    <dl class="meta">
      <div class="row">
        <dt>Dibuka</dt>
        <dd>{{ formatDate(product.opened_date) }}</dd>
      </div>
      <div class="row">
        <dt>Kedaluwarsa</dt>
        <dd>{{ formatDate(product.expiry_date) }}</dd>
      </div>
      <div class="row">
        <dt>Stok</dt>
        <dd>{{ product.quantity }}</dd>
      </div>
      <div class="row">
        <dt>Harga</dt>
        <dd>{{ formatRupiah(product.price) }}</dd>
      </div>
    </dl>

    <p v-if="product.notes" class="notes">“{{ product.notes }}”</p>

    <div class="actions">
      <button type="button" class="btn btn--soft" @click="$emit('edit', product)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        Ubah<span class="visually-hidden"> {{ product.name }}</span>
      </button>
      <button type="button" class="btn btn--danger" @click="$emit('remove', product)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>
        Hapus<span class="visually-hidden"> {{ product.name }}</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
/* Dasar: kolom fleksibel. Tombol selalu menempel di dasar kartu (margin-top: auto). */
.card {
  --accent: var(--pink-200);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  height: 100%;
  padding: 1.1rem 1.25rem 1.25rem;
  background: var(--white);
  border: 1px solid var(--pink-200);
  border-top: 4px solid var(--accent);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.card--ok {
  --accent: #9fd8b6;
}
.card--soon {
  --accent: #f3b58a;
}
.card--expired {
  --accent: #e98aa3;
}

.top {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  font-size: 1.4rem;
  background: var(--pink-50);
  border: 1px solid var(--pink-200);
  border-radius: 50%;
}
.title {
  min-width: 0;
}
h3 {
  font-size: 1.15rem;
  overflow-wrap: anywhere;
}
.brand {
  color: var(--plum-700);
  font-size: 0.9rem;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.5rem;
}

/* Baris label di kiri, nilai di kanan: tanggal tidak lagi terpotong */
.meta {
  margin: 0;
  padding: 0.35rem 0.9rem;
  background: var(--pink-50);
  border-radius: var(--radius);
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.45rem 0;
}
.row + .row {
  border-top: 1px dotted var(--pink-200);
}
.meta dt {
  font-size: 0.8125rem;
  color: var(--plum-700);
}
.meta dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
  white-space: nowrap;
}
.notes {
  font-style: italic;
  color: var(--plum-700);
}
.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: auto;
}

/* Browser modern: baris-baris antar kartu sebaris (judul, tag, rincian, catatan, tombol) berada di tinggi yang sama */
@supports (grid-template-rows: subgrid) {
  .card {
    display: grid;
    grid-row: span 5;
    grid-template-rows: subgrid;
    row-gap: 0.85rem;
    height: auto;
  }
  .top {
    grid-row: 1;
  }
  .tags {
    grid-row: 2;
  }
  .meta {
    grid-row: 3;
  }
  .notes {
    grid-row: 4;
  }
  .actions {
    grid-row: 5;
    align-self: end;
    margin-top: 0;
  }
}
</style>
