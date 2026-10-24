<script setup>
import { useRouter } from 'vue-router';
import { auth, signOut } from '../auth.js';

const router = useRouter();

async function logout() {
  await signOut();
  router.push({ name: 'home' });
}
</script>

<template>
  <header class="topbar">
    <div class="container bar">
      <RouterLink to="/" class="brand">
        <span aria-hidden="true">🎀</span> Skincare Tracker
      </RouterLink>

      <nav aria-label="Navigasi utama">
        <ul class="links">
          <li><RouterLink to="/">Beranda</RouterLink></li>
          <template v-if="auth.user">
            <li><RouterLink to="/produk">Produk</RouterLink></li>
            <li><RouterLink to="/jurnal">Jurnal Kulit</RouterLink></li>
            <li><RouterLink to="/ringkasan">Ringkasan</RouterLink></li>
            <li><RouterLink to="/profil">Profil</RouterLink></li>
            <li><button type="button" class="btn btn--ghost" @click="logout">Keluar</button></li>
          </template>
          <li v-else><RouterLink to="/auth/login" class="login-link">Masuk</RouterLink></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  background: var(--white);
  border-bottom: 1px solid var(--pink-200);
}
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1.5rem;
  flex-wrap: wrap;
  padding: 0.6rem 0;
}
.brand {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--plum-900);
  text-decoration: none;
}
.links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}
.links a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0.3rem 1rem;
  border-radius: 999px;
  font-weight: 600;
  color: var(--plum-900);
  text-decoration: none;
}
.links a:hover {
  background: var(--lilac-100);
}
.links a.router-link-exact-active {
  background: var(--plum-700);
  color: var(--white);
}
.links a.login-link:not(.router-link-exact-active) {
  background: var(--rose-700);
  color: var(--white);
}
</style>
