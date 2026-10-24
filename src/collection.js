import { reactive } from 'vue';
import { api } from './api.js';
import { summarize } from './utils/format.js';

// Data produk dan jurnal yang dipakai bersama halaman Produk, Jurnal, dan Ringkasan.
export const collection = reactive({
  products: [],
  routines: [],
  loading: false,
  message: { type: '', text: '' },
});

export function notify(type, text) {
  collection.message = { type, text };
}

export async function loadAll() {
  collection.loading = true;
  try {
    const [products, routines] = await Promise.all([api.listProducts(), api.listRoutines()]);
    collection.products = products;
    collection.routines = routines;
  } catch (error) {
    // 401 sudah ditangani handler sesi habis (kembali ke halaman login)
    if (error.status !== 401) notify('error', `Gagal memuat data: ${error.message}`);
  } finally {
    collection.loading = false;
  }
}

export function getStats() {
  return summarize(collection.products, collection.routines);
}

export function resetCollection() {
  collection.products = [];
  collection.routines = [];
  collection.loading = false;
  notify('', '');
}
