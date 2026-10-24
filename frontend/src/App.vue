<script setup>
import { computed, onMounted, ref } from 'vue';
import { api } from './api.js';
import { summarize } from './utils/format.js';
import AppHeader from './components/AppHeader.vue';
import SummaryCards from './components/SummaryCards.vue';
import ProductList from './components/ProductList.vue';
import RoutineJournal from './components/RoutineJournal.vue';
import ModalDialog from './components/ModalDialog.vue';
import ProductForm from './components/ProductForm.vue';
import RoutineForm from './components/RoutineForm.vue';

const tab = ref('products');
const products = ref([]);
const routines = ref([]);
const loading = ref(true);
const message = ref({ type: '', text: '' });

const productDialog = ref({ open: false, item: null });
const routineDialog = ref({ open: false, item: null });

const stats = computed(() => summarize(products.value, routines.value));

function notify(type, text) {
  message.value = { type, text };
}

async function loadAll() {
  loading.value = true;
  try {
    [products.value, routines.value] = await Promise.all([api.listProducts(), api.listRoutines()]);
  } catch (error) {
    notify('error', `Gagal memuat data: ${error.message}`);
  } finally {
    loading.value = false;
  }
}

function openProduct(item = null) {
  productDialog.value = { open: true, item };
}
function openRoutine(item = null) {
  routineDialog.value = { open: true, item };
}

async function onProductSaved() {
  const editing = Boolean(productDialog.value.item);
  productDialog.value = { open: false, item: null };
  await loadAll();
  notify('success', editing ? 'Produk berhasil diperbarui ✿' : 'Produk berhasil ditambahkan ✿');
}

async function onRoutineSaved() {
  const editing = Boolean(routineDialog.value.item);
  routineDialog.value = { open: false, item: null };
  await loadAll();
  notify('success', editing ? 'Catatan berhasil diperbarui ✿' : 'Catatan berhasil ditambahkan ✿');
}

async function removeProduct(product) {
  if (!window.confirm(`Hapus "${product.name}"? Semua catatan jurnal produk ini juga akan terhapus.`)) return;
  try {
    await api.deleteProduct(product.id);
    await loadAll();
    notify('success', 'Produk berhasil dihapus.');
  } catch (error) {
    notify('error', `Gagal menghapus produk: ${error.message}`);
  }
}

async function removeRoutine(entry) {
  if (!window.confirm('Hapus catatan jurnal ini?')) return;
  try {
    await api.deleteRoutine(entry.id);
    await loadAll();
    notify('success', 'Catatan berhasil dihapus.');
  } catch (error) {
    notify('error', `Gagal menghapus catatan: ${error.message}`);
  }
}

onMounted(loadAll);
</script>

<template>
  <a class="skip-link" href="#konten">Lewati ke konten utama</a>
  <AppHeader />

  <main id="konten" class="container main" tabindex="-1">
    <p
      v-if="message.text"
      class="notice"
      :class="`notice--${message.type}`"
      :role="message.type === 'error' ? 'alert' : 'status'"
    >
      <span>{{ message.text }}</span>
      <button type="button" class="btn btn--ghost" @click="notify('', '')">Tutup</button>
    </p>

    <SummaryCards :stats="stats" />

    <nav class="tabs" aria-label="Pilih tampilan">
      <button
        type="button"
        class="tab"
        :class="{ active: tab === 'products' }"
        :aria-current="tab === 'products' ? 'page' : undefined"
        @click="tab = 'products'"
      >
        Produk
      </button>
      <button
        type="button"
        class="tab"
        :class="{ active: tab === 'journal' }"
        :aria-current="tab === 'journal' ? 'page' : undefined"
        @click="tab = 'journal'"
      >
        Jurnal Kulit
      </button>
    </nav>

    <ProductList
      v-if="tab === 'products'"
      :products="products"
      :loading="loading"
      @add="openProduct()"
      @edit="openProduct($event)"
      @remove="removeProduct"
    />
    <RoutineJournal
      v-else
      :routines="routines"
      :products="products"
      :loading="loading"
      @add="openRoutine()"
      @edit="openRoutine($event)"
      @remove="removeRoutine"
    />
  </main>

  <ModalDialog
    :open="productDialog.open"
    :title="productDialog.item ? 'Ubah produk' : 'Tambah produk'"
    @close="productDialog = { open: false, item: null }"
  >
    <ProductForm
      :item="productDialog.item"
      @saved="onProductSaved"
      @cancel="productDialog = { open: false, item: null }"
    />
  </ModalDialog>

  <ModalDialog
    :open="routineDialog.open"
    :title="routineDialog.item ? 'Ubah catatan jurnal' : 'Tambah catatan jurnal'"
    @close="routineDialog = { open: false, item: null }"
  >
    <RoutineForm
      :item="routineDialog.item"
      :products="products"
      @saved="onRoutineSaved"
      @cancel="routineDialog = { open: false, item: null }"
    />
  </ModalDialog>
</template>

<style scoped>
.main {
  display: grid;
  gap: 1.5rem;
  padding: 1.5rem 0 3rem;
}
.main:focus {
  outline: none;
}
.notice {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  border: 1px solid currentColor;
  font-weight: 500;
}
.notice--success {
  background: var(--ok-bg);
  color: var(--ok-fg);
}
.notice--error {
  background: var(--danger-bg);
  color: var(--danger-fg);
}
.tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.35rem;
  width: fit-content;
  max-width: 100%;
  background: var(--lilac-100);
  border-radius: 999px;
  border: 1px solid var(--lilac-200);
}
.tab {
  font: inherit;
  font-weight: 600;
  min-height: 44px;
  padding: 0.4rem 1.4rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--plum-900);
  cursor: pointer;
}
.tab.active {
  background: var(--plum-700);
  color: var(--white);
}
</style>
