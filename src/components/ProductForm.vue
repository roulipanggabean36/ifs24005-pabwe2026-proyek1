<script setup>
import { reactive, ref, useId } from 'vue';
import { api } from '../api.js';
import { CATEGORY_LABELS } from '../utils/format.js';

const props = defineProps({
  item: { type: Object, default: null },
});
const emit = defineEmits(['saved', 'cancel']);

const uid = useId();
const form = reactive({
  name: props.item?.name ?? '',
  brand: props.item?.brand ?? '',
  category: props.item?.category ?? 'cleanser',
  opened_date: props.item?.opened_date ?? '',
  expiry_date: props.item?.expiry_date ?? '',
  quantity: props.item?.quantity ?? 1,
  price: props.item?.price ?? '',
  notes: props.item?.notes ?? '',
});
const errors = ref([]);
const submitting = ref(false);

function buildPayload() {
  return {
    name: form.name.trim(),
    brand: form.brand.trim(),
    category: form.category,
    opened_date: form.opened_date || null,
    expiry_date: form.expiry_date,
    quantity: Number(form.quantity),
    price: form.price === '' || form.price === null ? null : Number(form.price),
    notes: form.notes.trim() || null,
  };
}

async function submit() {
  const missing = [];
  if (!form.name.trim()) missing.push('Nama produk wajib diisi');
  if (!form.brand.trim()) missing.push('Merek wajib diisi');
  if (!form.expiry_date) missing.push('Tanggal kedaluwarsa wajib diisi');
  errors.value = missing;
  if (missing.length) return;

  submitting.value = true;
  try {
    const payload = buildPayload();
    const saved = props.item
      ? await api.updateProduct(props.item.id, payload)
      : await api.createProduct(payload);
    emit('saved', saved);
  } catch (error) {
    errors.value = error.details?.length ? error.details : [error.message];
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form class="form" novalidate @submit.prevent="submit">
    <div v-if="errors.length" class="error-box" role="alert">
      <p>Periksa kembali isian kamu:</p>
      <ul>
        <li v-for="message in errors" :key="message">{{ message }}</li>
      </ul>
    </div>

    <div class="field">
      <label :for="`${uid}-name`">Nama produk <span aria-hidden="true">*</span></label>
      <input :id="`${uid}-name`" v-model="form.name" class="input" type="text" required autocomplete="off" />
    </div>

    <div class="field">
      <label :for="`${uid}-brand`">Merek <span aria-hidden="true">*</span></label>
      <input :id="`${uid}-brand`" v-model="form.brand" class="input" type="text" required autocomplete="off" />
    </div>

    <div class="field">
      <label :for="`${uid}-category`">Kategori</label>
      <select :id="`${uid}-category`" v-model="form.category" class="input">
        <option v-for="(label, key) in CATEGORY_LABELS" :key="key" :value="key">{{ label }}</option>
      </select>
    </div>

    <div class="row">
      <div class="field">
        <label :for="`${uid}-opened`">Tanggal dibuka</label>
        <input :id="`${uid}-opened`" v-model="form.opened_date" class="input" type="date" />
      </div>
      <div class="field">
        <label :for="`${uid}-expiry`">Tanggal kedaluwarsa <span aria-hidden="true">*</span></label>
        <input :id="`${uid}-expiry`" v-model="form.expiry_date" class="input" type="date" required />
      </div>
    </div>

    <div class="row">
      <div class="field">
        <label :for="`${uid}-qty`">Stok</label>
        <input :id="`${uid}-qty`" v-model="form.quantity" class="input" type="number" min="0" step="1" />
      </div>
      <div class="field">
        <label :for="`${uid}-price`">Harga (Rp)</label>
        <input :id="`${uid}-price`" v-model="form.price" class="input" type="number" min="0" step="1" placeholder="25000" />
      </div>
    </div>

    <div class="field">
      <label :for="`${uid}-notes`">Catatan</label>
      <textarea :id="`${uid}-notes`" v-model="form.notes" class="input" rows="3"></textarea>
    </div>

    <p class="hint"><span aria-hidden="true">*</span> wajib diisi</p>

    <div class="actions">
      <button type="submit" class="btn btn--primary" :disabled="submitting">
        {{ submitting ? 'Menyimpan…' : item ? 'Simpan perubahan' : 'Simpan produk' }}
      </button>
      <button type="button" class="btn btn--ghost" @click="emit('cancel')">Batal</button>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: grid;
  gap: 1rem;
}
.row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
</style>
