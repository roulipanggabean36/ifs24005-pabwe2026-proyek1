<script setup>
import { reactive, ref, useId } from 'vue';
import { api } from '../api.js';
import { CONDITION_LABELS, TIME_LABELS, todayISO } from '../utils/format.js';

const props = defineProps({
  item: { type: Object, default: null },
  products: { type: Array, required: true },
});
const emit = defineEmits(['saved', 'cancel']);

const uid = useId();
const form = reactive({
  product_id: props.item?.product_id ?? props.products[0]?.id ?? '',
  used_at: props.item?.used_at ?? todayISO(),
  time_of_day: props.item?.time_of_day ?? 'morning',
  skin_condition: props.item?.skin_condition ?? 'good',
  skin_rating: props.item?.skin_rating ?? '',
  notes: props.item?.notes ?? '',
});
const errors = ref([]);
const submitting = ref(false);

function buildPayload() {
  return {
    product_id: Number(form.product_id),
    used_at: form.used_at,
    time_of_day: form.time_of_day,
    skin_condition: form.skin_condition,
    skin_rating: form.skin_rating === '' ? null : Number(form.skin_rating),
    notes: form.notes.trim() || null,
  };
}

async function submit() {
  const missing = [];
  if (!form.product_id) missing.push('Pilih produk yang dipakai');
  if (!form.used_at) missing.push('Tanggal pemakaian wajib diisi');
  errors.value = missing;
  if (missing.length) return;

  submitting.value = true;
  try {
    const payload = buildPayload();
    const saved = props.item
      ? await api.updateRoutine(props.item.id, payload)
      : await api.createRoutine(payload);
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
      <label :for="`${uid}-product`">Produk yang dipakai <span aria-hidden="true">*</span></label>
      <select :id="`${uid}-product`" v-model="form.product_id" class="input" required>
        <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }} ({{ p.brand }})</option>
      </select>
    </div>

    <div class="row">
      <div class="field">
        <label :for="`${uid}-date`">Tanggal <span aria-hidden="true">*</span></label>
        <input :id="`${uid}-date`" v-model="form.used_at" class="input" type="date" required />
      </div>

      <fieldset class="field time">
        <legend>Waktu pemakaian</legend>
        <label v-for="(label, key) in TIME_LABELS" :key="key" class="radio">
          <input v-model="form.time_of_day" type="radio" name="time_of_day" :value="key" />
          {{ label }}
        </label>
      </fieldset>
    </div>

    <div class="row">
      <div class="field">
        <label :for="`${uid}-condition`">Kondisi kulit</label>
        <select :id="`${uid}-condition`" v-model="form.skin_condition" class="input">
          <option v-for="(label, key) in CONDITION_LABELS" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>
      <div class="field">
        <label :for="`${uid}-rating`">Nilai kulit hari ini</label>
        <select :id="`${uid}-rating`" v-model="form.skin_rating" class="input">
          <option value="">Tidak dinilai</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }} dari 5</option>
        </select>
      </div>
    </div>

    <div class="field">
      <label :for="`${uid}-notes`">Jurnal singkat</label>
      <textarea :id="`${uid}-notes`" v-model="form.notes" class="input" rows="3" placeholder="Bagaimana rasa kulitmu hari ini?"></textarea>
    </div>

    <p class="hint"><span aria-hidden="true">*</span> wajib diisi</p>

    <div class="actions">
      <button type="submit" class="btn btn--primary" :disabled="submitting">
        {{ submitting ? 'Menyimpan…' : item ? 'Simpan perubahan' : 'Simpan catatan' }}
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
.time {
  border: 0;
  padding: 0;
  margin: 0;
}
.radio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 32px;
  font-weight: 500;
}
.radio input {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: var(--rose-700);
}
.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
</style>
