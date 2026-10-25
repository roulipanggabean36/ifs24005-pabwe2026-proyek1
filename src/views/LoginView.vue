<script setup>
import { nextTick, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageHero from '../components/PageHero.vue';
import { auth, signIn, signOut } from '../auth.js';
import { safeRedirect } from '../router.js';

const route = useRoute();
const router = useRouter();

const form = reactive({ email: '', password: '' });
const fieldErrors = reactive({ email: '', password: '' });
const formError = ref('');
const showPassword = ref(false);
const submitting = ref(false);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate() {
  fieldErrors.email = '';
  fieldErrors.password = '';
  const email = form.email.trim();
  if (!email) fieldErrors.email = 'Email wajib diisi';
  else if (!EMAIL_PATTERN.test(email)) fieldErrors.email = 'Format email tidak valid, contoh: nama@email.com';
  if (!form.password) fieldErrors.password = 'Kata sandi wajib diisi';
  return !fieldErrors.email && !fieldErrors.password;
}

async function submit() {
  formError.value = '';
  if (!validate()) {
    await nextTick();
    document.getElementById(fieldErrors.email ? 'username' : 'password')?.focus();
    return;
  }

  submitting.value = true;
  try {
    await signIn(form.email.trim(), form.password);
    await router.push(safeRedirect(route.query.redirect));
  } catch (error) {
    formError.value = error.details?.length ? error.details.join('. ') : error.message;
    form.password = '';
    await nextTick();
    document.getElementById('password')?.focus();
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <PageHero title="Masuk" subtitle="Masuk dengan email dan kata sandi untuk mengelola koleksi skincare-mu." />

  <div class="container page narrow">
    <section v-if="auth.user" class="card" aria-labelledby="already-heading">
      <h2 id="already-heading">Kamu sudah masuk</h2>
      <p>
        Masuk sebagai <strong>{{ auth.user.email }}</strong
        >.
      </p>
      <div class="actions">
        <RouterLink class="btn btn--primary" to="/produk">Buka koleksi produk</RouterLink>
        <button type="button" class="btn btn--ghost" @click="signOut">Keluar</button>
      </div>
    </section>

    <section v-else class="card" aria-labelledby="login-heading">
      <h2 id="login-heading">Selamat datang kembali</h2>

      <form class="form" novalidate @submit.prevent="submit">
        <div v-if="formError" class="error-box" role="alert">{{ formError }}</div>

        <div class="field">
          <label for="username">Email</label>
          <input
            id="username"
            v-model="form.email"
            class="input"
            type="email"
            name="email"
            autocomplete="email"
            inputmode="email"
            required
            placeholder="nama@email.com"
            :aria-invalid="fieldErrors.email ? 'true' : undefined"
            :aria-describedby="fieldErrors.email ? 'email-error' : undefined"
          />
          <p v-if="fieldErrors.email" id="email-error" class="field-error">{{ fieldErrors.email }}</p>
        </div>

        <div class="field">
          <label for="password">Kata sandi</label>
          <input
            v-if="showPassword"
            id="password"
            v-model="form.password"
            class="input"
            type="text"
            name="password"
            autocomplete="off"
            required
            :aria-invalid="fieldErrors.password ? 'true' : undefined"
            :aria-describedby="fieldErrors.password ? 'password-error' : undefined"
          />
          <input
            v-else
            id="password"
            v-model="form.password"
            class="input"
            type="password"
            name="password"
            autocomplete="current-password"
            required
            :aria-invalid="fieldErrors.password ? 'true' : undefined"
            :aria-describedby="fieldErrors.password ? 'password-error' : undefined"
          />
          <p v-if="fieldErrors.password" id="password-error" class="field-error">{{ fieldErrors.password }}</p>
        </div>

        <div class="show">
          <input id="show-password" v-model="showPassword" type="checkbox" />
          <label for="show-password">Tampilkan kata sandi</label>
        </div>

        <button id="btn-submit" type="submit" class="btn btn--primary" :disabled="submitting">
          {{ submitting ? 'Memproses…' : 'Masuk' }}
        </button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.narrow {
  max-width: 480px;
}
.card {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--white);
  border: 1px solid var(--pink-200);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.form {
  display: grid;
  gap: 1rem;
}
.field-error {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--danger-fg);
}
.show {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.show input {
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
