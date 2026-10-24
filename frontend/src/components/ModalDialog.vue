<script setup>
import { nextTick, ref, useId, watch } from 'vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
});
const emit = defineEmits(['close']);

const dialog = ref(null);
const titleId = useId();

// <dialog> bawaan browser: fokus terkunci di dalam dialog dan tombol Esc menutupnya.
watch(
  () => props.open,
  async (isOpen) => {
    await nextTick();
    if (!dialog.value) return;
    if (isOpen && !dialog.value.open) dialog.value.showModal();
    if (!isOpen && dialog.value.open) dialog.value.close();
  },
  { immediate: true }
);
</script>

<template>
  <dialog ref="dialog" class="modal" :aria-labelledby="titleId" @close="emit('close')" @click.self="emit('close')">
    <div v-if="open" class="body">
      <div class="head">
        <h2 :id="titleId">{{ title }}</h2>
        <button type="button" class="btn btn--ghost" @click="emit('close')">Tutup</button>
      </div>
      <slot />
    </div>
  </dialog>
</template>

<style scoped>
.modal {
  width: min(560px, 100% - 1.5rem);
  max-height: 92vh;
  padding: 0;
  border: 1px solid var(--rose-700);
  border-radius: var(--radius);
  background: var(--pink-50);
  color: var(--plum-900);
  box-shadow: 0 20px 50px rgba(63, 21, 54, 0.35);
}
.modal::backdrop {
  background: rgba(63, 21, 54, 0.5);
}
.body {
  padding: 1.25rem 1.5rem 1.5rem;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>
