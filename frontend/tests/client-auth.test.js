import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { api, setUnauthorizedHandler } from '../src/api.js';
import { auth, initAuth, signIn, signOut, clearAuth, resetAuth } from '../src/auth.js';
import { collection, loadAll, notify, getStats, resetCollection } from '../src/collection.js';
import { authGuard, safeRedirect, routes, createAppRouter } from '../src/router.js';
import { createMemoryHistory } from 'vue-router';

// Konfigurasi vitest di root tidak memuat plugin Vue, jadi file .vue diganti komponen kosong
vi.mock('../src/views/LoginView.vue', () => ({ default: { render: () => null } }));
vi.mock('../src/views/ProfileView.vue', () => ({ default: { render: () => null } }));

const originalFetch = globalThis.fetch;
let calls;

const json = (payload, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => payload,
});

// routes: { '/auth/me': respons, ... } dicocokkan dengan akhir URL
function mockApi(routesMap) {
  calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    const key = Object.keys(routesMap).find((k) => url.endsWith(k));
    return key ? routesMap[key] : json({ success: false, message: 'tidak ada' }, 404);
  };
}

const user = { id: 1, name: 'Pengguna Uji', email: 'admin@skincare.test', created_at: '2026-10-01 08:00:00' };

beforeEach(() => {
  resetAuth();
  resetCollection();
  setUnauthorizedHandler(null);
});
afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('api auth', () => {
  it('mengirim kredensial ke /auth/login lewat POST', async () => {
    mockApi({ '/auth/login': json({ success: true, data: { user } }) });
    const data = await api.login({ email: 'a@b.co', password: 'x' });
    expect(data.user.email).toBe(user.email);
    expect(calls[0].url).toBe('/api/auth/login');
    expect(calls[0].options.method).toBe('POST');
    expect(calls[0].options.body).toBe('{"email":"a@b.co","password":"x"}');
  });

  it('memanggil handler sesi habis hanya untuk 401 di endpoint data', async () => {
    let fired = 0;
    setUnauthorizedHandler(() => (fired += 1));
    mockApi({
      '/products': json({ success: false, message: 'Silakan masuk' }, 401),
      '/auth/login': json({ success: false, message: 'Email atau kata sandi salah' }, 401),
    });
    await expect(api.listProducts()).rejects.toThrow('Silakan masuk');
    expect(fired).toBe(1);
    await expect(api.login({})).rejects.toThrow('Email atau kata sandi salah');
    expect(fired).toBe(1);
  });

  it('tidak error jika tidak ada handler sesi habis', async () => {
    mockApi({ '/products': json({ success: false, message: 'x' }, 401) });
    await expect(api.listProducts()).rejects.toThrow('x');
  });
});

describe('state auth', () => {
  it('initAuth memuat pengguna dari /auth/me dan hanya memanggil server sekali', async () => {
    mockApi({ '/auth/me': json({ success: true, data: { user } }) });
    await Promise.all([initAuth(), initAuth()]);
    await initAuth();
    expect(auth.user.email).toBe(user.email);
    expect(auth.ready).toBe(true);
    expect(calls).toHaveLength(1);
  });

  it('initAuth menganggap belum login jika server membalas user null atau error', async () => {
    mockApi({ '/auth/me': json({ success: true, data: { user: null } }) });
    await initAuth();
    expect(auth.user).toBeNull();
    expect(auth.ready).toBe(true);

    resetAuth();
    mockApi({ '/auth/me': json({ success: false, message: 'Silakan masuk' }, 401) });
    await initAuth();
    expect(auth.user).toBeNull();
    expect(auth.ready).toBe(true);
  });

  it('signIn menyimpan pengguna, dan melempar error jika kredensial salah', async () => {
    mockApi({ '/auth/login': json({ success: true, data: { user } }) });
    expect((await signIn('admin@skincare.test', 'Admin123!')).name).toBe('Pengguna Uji');
    expect(auth.user).toEqual(user);

    clearAuth();
    mockApi({ '/auth/login': json({ success: false, message: 'Email atau kata sandi salah' }, 401) });
    await expect(signIn('a@b.co', 'x')).rejects.toThrow('Email atau kata sandi salah');
    expect(auth.user).toBeNull();
  });

  it('signOut membersihkan pengguna dan data walaupun server gagal dihubungi', async () => {
    auth.user = user;
    collection.products = [{ id: 1, days_left: 5 }];
    globalThis.fetch = async () => {
      throw new Error('jaringan putus');
    };
    await signOut();
    expect(auth.user).toBeNull();
    expect(collection.products).toEqual([]);
  });

  it('signOut memanggil /auth/logout', async () => {
    auth.user = user;
    mockApi({ '/auth/logout': json({ success: true, data: { loggedOut: true } }) });
    await signOut();
    expect(calls[0].url).toBe('/api/auth/logout');
    expect(auth.user).toBeNull();
  });
});

describe('collection', () => {
  it('loadAll mengisi produk dan jurnal serta menghitung ringkasan', async () => {
    mockApi({
      '/products': json({ success: true, data: [{ id: 1, days_left: 10 }, { id: 2, days_left: -3 }, { id: 3, days_left: 200 }] }),
      '/routines': json({ success: true, data: [{ id: 1 }] }),
    });
    await loadAll();
    expect(collection.loading).toBe(false);
    expect(getStats()).toEqual({ totalProducts: 3, expiringSoon: 1, expired: 1, totalEntries: 1 });
  });

  it('loadAll menampilkan pesan error, kecuali untuk 401', async () => {
    mockApi({ '/products': json({ success: false, message: 'server error' }, 500), '/routines': json({ success: true, data: [] }) });
    await loadAll();
    expect(collection.message).toEqual({ type: 'error', text: 'Gagal memuat data: server error' });

    notify('', '');
    mockApi({ '/products': json({ success: false, message: 'Silakan masuk' }, 401), '/routines': json({ success: false, message: 'Silakan masuk' }, 401) });
    await loadAll();
    expect(collection.message.text).toBe('');
  });
});

describe('router', () => {
  it('guard mengarahkan tamu ke login dengan tujuan semula, pengguna masuk lolos', () => {
    const to = { meta: { requiresAuth: true }, fullPath: '/produk?q=wardah' };
    expect(authGuard(to, { user: null })).toEqual({ name: 'login', query: { redirect: '/produk?q=wardah' } });
    expect(authGuard(to, { user })).toBe(true);
    expect(authGuard({ meta: {}, fullPath: '/' }, { user: null })).toBe(true);
    expect(authGuard({ fullPath: '/' }, { user: null })).toBe(true);
  });

  it('safeRedirect hanya menerima path internal', () => {
    expect(safeRedirect('/jurnal')).toBe('/jurnal');
    expect(safeRedirect('//evil.com')).toBe('/produk');
    expect(safeRedirect('https://evil.com')).toBe('/produk');
    expect(safeRedirect(undefined)).toBe('/produk');
    expect(safeRedirect(['/a'])).toBe('/produk');
    expect(safeRedirect('x', '/')).toBe('/');
  });

  it('empat halaman terproteksi dan dua halaman publik terdaftar', () => {
    const protectedPaths = routes.filter((r) => r.meta.requiresAuth).map((r) => r.path);
    expect(protectedPaths).toEqual(['/produk', '/jurnal', '/ringkasan', '/profil']);
    const publicPaths = routes.filter((r) => !r.meta.requiresAuth).map((r) => r.path);
    expect(publicPaths).toContain('/');
    expect(publicPaths).toContain('/auth/login');
  });

  it('router menahan tamu di login dan membiarkan pengguna masuk membuka halaman terproteksi', async () => {
    mockApi({ '/auth/me': json({ success: true, data: { user: null } }) });
    const guest = createAppRouter(createMemoryHistory());
    await guest.push('/ringkasan');
    expect(guest.currentRoute.value.name).toBe('login');
    expect(guest.currentRoute.value.query.redirect).toBe('/ringkasan');

    resetAuth();
    mockApi({ '/auth/me': json({ success: true, data: { user } }) });
    const member = createAppRouter(createMemoryHistory());
    await member.push('/profil');
    expect(member.currentRoute.value.name).toBe('profile');
  });
});
