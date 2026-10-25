<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { api } from '../api.js';
import PageHero from '../components/PageHero.vue';
import NoticeBar from '../components/NoticeBar.vue';
import ProductList from '../components/ProductList.vue';
import ModalDialog from '../components/ModalDialog.vue';
import ProductForm from '../components/ProductForm.vue';
import { collection, loadAll, notify } from '../collection.js';

const dialog = ref({ open: false, item: null });

onMounted(loadAll);
onUnmounted(() => notify('', ''));

function openDialog(item = null) {
  dialog.value = { open: true, item };
}
function closeDialog() {
  dialog.value = { open: false, item: null };
}

async function onSaved() {
  const editing = Boolean(dialog.value.item);
  closeDialog();
  await loadAll();
  notify('success', editing ? 'Produk berhasil diperbarui ✿' : 'Produk berhasil ditambahkan ✿');
}

async function remove(product) {
  if (!globalThis.confirm(`Hapus "${product.name}"? Semua catatan jurnal produk ini juga akan terhapus.`)) return;
  try {
    await api.deleteProduct(product.id);
    await loadAll();
    notify('success', 'Produk berhasil dihapus.');
  } catch (error) {
    if (error.status !== 401) notify('error', `Gagal menghapus produk: ${error.message}`);
  }
}
</script>

<template>
  <PageHero title="Produk Skincare" subtitle="Kelola koleksi produkmu dan pantau tanggal kedaluwarsanya." />

  <div class="container page">
    <NoticeBar />
    <ProductList
      :products="collection.products"
      :loading="collection.loading"
      @add="openDialog()"
      @edit="openDialog($event)"
      @remove="remove"
    />
  </div>

  <ModalDialog :open="dialog.open" :title="dialog.item ? 'Ubah produk' : 'Tambah produk'" @close="closeDialog">
    <ProductForm :item="dialog.item" @saved="onSaved" @cancel="closeDialog" />
  </ModalDialog>
</template>
