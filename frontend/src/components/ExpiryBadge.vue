<script setup>
import { computed } from 'vue';
import { expiryStatus } from '../utils/format.js';

const props = defineProps({
  daysLeft: { type: Number, required: true },
});

const status = computed(() => expiryStatus(props.daysLeft));
const icon = computed(() => ({ ok: '✓', soon: '⏳', expired: '⚠' })[status.value.key]);
</script>

<template>
  <span class="badge" :class="`badge--${status.key}`">
    <span aria-hidden="true">{{ icon }}</span>
    {{ status.label }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  width: fit-content;
  justify-self: start;
  padding: 0.1rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid currentColor;
}
.badge--ok {
  background: var(--ok-bg);
  color: var(--ok-fg);
}
.badge--soon {
  background: var(--warn-bg);
  color: var(--warn-fg);
}
.badge--expired {
  background: var(--danger-bg);
  color: var(--danger-fg);
}
</style>
