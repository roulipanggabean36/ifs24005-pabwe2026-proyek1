import { createApp } from 'vue';
import App from './App.vue';
import { createAppRouter } from './router.js';
import { setUnauthorizedHandler } from './api.js';
import { clearAuth } from './auth.js';
import { resetCollection } from './collection.js';
import './styles/global.css';

const router = createAppRouter();

// Sesi habis saat memakai aplikasi: bersihkan state lalu arahkan ke halaman login
setUnauthorizedHandler(() => {
  clearAuth();
  resetCollection();
  router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
});

createApp(App).use(router).mount('#app');
