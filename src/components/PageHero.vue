<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
});
</script>

<template>
  <div class="hero">
    <div class="container">
      <p class="eyebrow" aria-hidden="true">✿ ・ 🎀 ・ ✿</p>
      <h1>{{ title }}</h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<style scoped>
.hero {
  padding: 2.5rem 0 1.5rem;
  text-align: center;
  background: linear-gradient(135deg, var(--pink-100), var(--lilac-100) 60%, var(--peach-100));
  border-bottom: 2px dotted var(--rose-700);
}
.eyebrow {
  color: var(--rose-700);
  letter-spacing: 0.35em;
  margin-bottom: 0.5rem;
}
h1 {
  font-size: clamp(1.7rem, 4vw, 2.6rem);
  font-weight: 700;
}
.subtitle {
  max-width: 40rem;
  margin: 0.75rem auto 0;
  color: var(--plum-700);
}
</style>
