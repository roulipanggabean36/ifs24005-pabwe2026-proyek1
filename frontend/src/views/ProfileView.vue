<script setup>
import { useRouter } from 'vue-router';
import PageHero from '../components/PageHero.vue';
import { auth, signOut } from '../auth.js';
import { formatDate } from '../utils/format.js';

const router = useRouter();

async function logout() {
  await signOut();
  router.push({ name: 'home' });
}
</script>

<template>
  <PageHero title="Profil" subtitle="Informasi akun yang sedang masuk." />

  <div class="container page narrow">
    <section v-if="auth.user" class="card" aria-labelledby="akun-heading">
      <h2 id="akun-heading">Data akun</h2>
      <dl class="meta">
        <div>
          <dt>Nama</dt>
          <dd>{{ auth.user.name }}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{{ auth.user.email }}</dd>
        </div>
        <div>
          <dt>Terdaftar sejak</dt>
          <dd>{{ formatDate(auth.user.created_at?.slice(0, 10)) }}</dd>
        </div>
      </dl>
      <div>
        <button type="button" class="btn btn--ghost" @click="logout">Keluar</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.narrow {
  max-width: 560px;
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
.meta {
  display: grid;
  gap: 0.75rem;
  margin: 0;
}
dt {
  font-size: 0.875rem;
  color: var(--plum-700);
}
dd {
  margin: 0;
  font-weight: 600;
  overflow-wrap: anywhere;
}
</style>
