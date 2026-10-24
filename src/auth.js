import { reactive } from 'vue';
import { api } from './api.js';
import { resetCollection } from './collection.js';

// State login bersama seluruh aplikasi. Sesi disimpan server dalam cookie httpOnly,
// jadi di sini hanya ada data pengguna yang sedang masuk.
export const auth = reactive({ user: null, ready: false });

let pending = null;

// Cek sesi ke server satu kali (dipakai route guard sebelum halaman pertama tampil).
export function initAuth() {
  if (!pending) {
    pending = api
      .me()
      .then((data) => {
        auth.user = data.user;
      })
      .catch(() => {
        auth.user = null;
      })
      .finally(() => {
        auth.ready = true;
      });
  }
  return pending;
}

export async function signIn(email, password) {
  const data = await api.login({ email, password });
  auth.user = data.user;
  auth.ready = true;
  return data.user;
}

// Selalu membersihkan state di sisi klien, walaupun permintaan logout ke server gagal.
export async function signOut() {
  try {
    await api.logout();
  } catch {
    // Server tidak terjangkau: sesi lokal tetap diakhiri
  } finally {
    clearAuth();
    resetCollection();
  }
}

export function clearAuth() {
  auth.user = null;
}

// Hanya untuk pengujian
export function resetAuth() {
  pending = null;
  auth.user = null;
  auth.ready = false;
}
