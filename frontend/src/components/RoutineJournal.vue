<script setup>
import { computed } from 'vue';
import { CONDITION_LABELS, TIME_LABELS, formatDate, ratingStars } from '../utils/format.js';

const props = defineProps({
  routines: { type: Array, required: true },
  products: { type: Array, required: true },
  loading: { type: Boolean, default: false },
});
defineEmits(['add', 'edit', 'remove']);

// Kelompokkan catatan per tanggal (data dari API sudah terurut terbaru lebih dulu)
const groups = computed(() => {
  const map = new Map();
  for (const entry of props.routines) {
    if (!map.has(entry.used_at)) map.set(entry.used_at, []);
    map.get(entry.used_at).push(entry);
  }
  return [...map.entries()].map(([date, items]) => ({ date, items }));
});
</script>

<template>
  <section aria-labelledby="journal-heading">
    <div class="head">
      <h2 id="journal-heading">Jurnal Kondisi Kulit</h2>
      <button type="button" class="btn btn--primary" :disabled="!products.length" @click="$emit('add')">
        + Tambah catatan
      </button>
    </div>
    <p v-if="!products.length" class="hint">Tambahkan produk dulu agar bisa menulis jurnal pemakaian.</p>

    <p v-if="loading" class="empty" role="status">Sedang memuat jurnal…</p>
    <p v-else-if="!routines.length" class="empty">Belum ada catatan. Tulis kondisi kulitmu hari ini ✿</p>

    <div v-else class="days">
      <section v-for="group in groups" :key="group.date" class="day" :aria-label="formatDate(group.date)">
        <h3>{{ formatDate(group.date) }}</h3>
        <ul class="entries">
          <li v-for="entry in group.items" :key="entry.id" class="entry">
            <div class="line">
              <span class="chip">{{ TIME_LABELS[entry.time_of_day] }}</span>
              <strong>{{ entry.product_name }}</strong>
              <span class="brand">{{ entry.product_brand }}</span>
            </div>
            <p class="line">
              <span class="chip cond">{{ CONDITION_LABELS[entry.skin_condition] }}</span>
              <span v-if="entry.skin_rating" class="stars" :aria-label="`Nilai ${entry.skin_rating} dari 5`">
                {{ ratingStars(entry.skin_rating) }}
              </span>
            </p>
            <p v-if="entry.notes" class="notes">“{{ entry.notes }}”</p>
            <div class="actions">
              <button type="button" class="btn btn--soft" @click="$emit('edit', entry)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                Ubah<span class="visually-hidden"> catatan {{ entry.product_name }} {{ formatDate(entry.used_at) }}</span>
              </button>
              <button type="button" class="btn btn--danger" @click="$emit('remove', entry)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>
                Hapus<span class="visually-hidden"> catatan {{ entry.product_name }} {{ formatDate(entry.used_at) }}</span>
              </button>
            </div>
          </li>
        </ul>
      </section>
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
.days {
  display: grid;
  gap: 1.5rem;
}
.day h3 {
  margin-bottom: 0.6rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px dotted var(--rose-700);
}
.entries {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}
.entry {
  display: grid;
  gap: 0.4rem;
  padding: 1rem 1.25rem;
  background: var(--white);
  border: 1px solid var(--lilac-200);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.line {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex-wrap: wrap;
}
.brand {
  color: var(--plum-700);
  font-size: 0.9rem;
}
.cond {
  background: var(--peach-100);
}
.stars {
  color: var(--rose-700);
  letter-spacing: 0.1em;
}
.notes {
  font-style: italic;
  color: var(--plum-700);
}
.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
