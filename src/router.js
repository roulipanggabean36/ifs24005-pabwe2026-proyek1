import { createRouter, createWebHistory, START_LOCATION } from 'vue-router';
import { nextTick } from 'vue';
import { auth, initAuth } from './auth.js';

export const routes = [
  { path: '/', name: 'home', component: () => import('./views/HomeView.vue'), meta: { title: 'Beranda' } },
  { path: '/auth/login', name: 'login', component: () => import('./views/LoginView.vue'), meta: { title: 'Masuk' } },
  { path: '/produk', name: 'products', component: () => import('./views/ProductsView.vue'), meta: { title: 'Produk', requiresAuth: true } },
  { path: '/jurnal', name: 'journal', component: () => import('./views/JournalView.vue'), meta: { title: 'Jurnal Kulit', requiresAuth: true } },
  { path: '/ringkasan', name: 'summary', component: () => import('./views/SummaryView.vue'), meta: { title: 'Ringkasan', requiresAuth: true } },
  { path: '/profil', name: 'profile', component: () => import('./views/ProfileView.vue'), meta: { title: 'Profil', requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./views/NotFoundView.vue'), meta: { title: 'Halaman tidak ditemukan' } },
];

// Hanya path internal yang boleh dipakai sebagai tujuan setelah login (cegah open redirect)
export function safeRedirect(value, fallback = '/produk') {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : fallback;
}

// Menentukan apakah tujuan boleh dibuka. Selalu mengembalikan objek { allowed, redirect }
export function authGuard(to, state = auth) {
  const blocked = Boolean(to.meta?.requiresAuth) && !state.user;
  const redirect = blocked ? { name: 'login', query: { redirect: to.fullPath } } : null;
  return { allowed: !blocked, redirect };
}

export function createAppRouter(history = createWebHistory()) {
  const router = createRouter({ history, routes });

  router.beforeEach(async (to) => {
    await initAuth();
    const { allowed, redirect } = authGuard(to);
    return allowed || redirect;
  });

  router.afterEach((to, from) => {
    if (typeof document === 'undefined') return;
    document.title = `${typeof to.meta.title === 'string' ? to.meta.title : ''} · Skincare Tracker`;
    // Pindahkan fokus ke konten utama agar pembaca layar tahu halaman sudah berganti
    if (from !== START_LOCATION) nextTick(() => document.getElementById('konten')?.focus());
  });

  return router;
}
