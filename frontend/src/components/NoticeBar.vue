<script setup>
import { collection, notify } from '../collection.js';
</script>

<template>
  <p
    v-if="collection.message.text"
    class="notice"
    :class="`notice--${collection.message.type}`"
    :role="collection.message.type === 'error' ? 'alert' : 'status'"
  >
    <span>{{ collection.message.text }}</span>
    <button type="button" class="btn btn--ghost" @click="notify('', '')">Tutup</button>
  </p>
</template>

<style scoped>
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
</style>
