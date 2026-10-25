<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { api } from '../api.js';
import PageHero from '../components/PageHero.vue';
import NoticeBar from '../components/NoticeBar.vue';
import RoutineJournal from '../components/RoutineJournal.vue';
import ModalDialog from '../components/ModalDialog.vue';
import RoutineForm from '../components/RoutineForm.vue';
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
  notify('success', editing ? 'Catatan berhasil diperbarui ✿' : 'Catatan berhasil ditambahkan ✿');
}

async function remove(entry) {
  if (!globalThis.confirm('Hapus catatan jurnal ini?')) return;
  try {
    await api.deleteRoutine(entry.id);
    await loadAll();
    notify('success', 'Catatan berhasil dihapus.');
  } catch (error) {
    if (error.status !== 401) notify('error', `Gagal menghapus catatan: ${error.message}`);
  }
}
</script>

<template>
  <PageHero title="Jurnal Kulit" subtitle="Tulis kondisi kulitmu setiap hari bersama produk yang dipakai." />

  <div class="container page">
    <NoticeBar />
    <RoutineJournal
      :routines="collection.routines"
      :products="collection.products"
      :loading="collection.loading"
      @add="openDialog()"
      @edit="openDialog($event)"
      @remove="remove"
    />
  </div>

  <ModalDialog :open="dialog.open" :title="dialog.item ? 'Ubah catatan jurnal' : 'Tambah catatan jurnal'" @close="closeDialog">
    <RoutineForm :item="dialog.item" :products="collection.products" @saved="onSaved" @cancel="closeDialog" />
  </ModalDialog>
</template>
