import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { api } from '../src/api.js';

const originalFetch = globalThis.fetch;
let calls;

function mockFetch(response) {
  calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return response;
  };
}

const jsonResponse = (payload, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => payload,
});

beforeEach(() => {
  calls = [];
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('api client', () => {
  it('mengambil data dan hanya mengirim parameter yang terisi', async () => {
    mockFetch(jsonResponse({ success: true, data: [{ id: 1 }] }));
    const result = await api.listProducts({ category: 'serum', search: '', expiring: undefined });

    expect(result).toEqual([{ id: 1 }]);
    expect(calls[0].url).toBe('/api/products?category=serum');
    expect(calls[0].options.method).toBe('GET');
    expect(calls[0].options.body).toBeUndefined();
  });

  it('memanggil daftar tanpa parameter', async () => {
    mockFetch(jsonResponse({ success: true, data: [] }));
    await api.listRoutines();
    expect(calls[0].url).toBe('/api/routines');
  });

  it('mengirim body JSON untuk POST dan PUT', async () => {
    mockFetch(jsonResponse({ success: true, data: { id: 3 } }, 201));
    await api.createProduct({ name: 'Toner' });
    expect(calls[0].url).toBe('/api/products');
    expect(calls[0].options.method).toBe('POST');
    expect(calls[0].options.body).toBe('{"name":"Toner"}');

    await api.updateProduct(3, { name: 'Toner Baru' });
    expect(calls[1].url).toBe('/api/products/3');
    expect(calls[1].options.method).toBe('PUT');

    await api.createRoutine({ product_id: 3 });
    await api.updateRoutine(9, { product_id: 3 });
    expect(calls[2].url).toBe('/api/routines');
    expect(calls[3].url).toBe('/api/routines/9');
  });

  it('memakai metode DELETE', async () => {
    mockFetch(jsonResponse({ success: true, data: { id: 3 } }));
    await api.deleteProduct(3);
    await api.deleteRoutine(4);
    expect(calls[0].options.method).toBe('DELETE');
    expect(calls[0].url).toBe('/api/products/3');
    expect(calls[1].url).toBe('/api/routines/4');
  });

  it('melempar error berisi pesan dan detail dari server', async () => {
    mockFetch(
      jsonResponse({ success: false, message: 'Validasi gagal', errors: ['name wajib diisi'] }, 400)
    );
    let error;
    try {
      await api.createProduct({});
    } catch (e) {
      error = e;
    }
    expect(error.message).toBe('Validasi gagal');
    expect(error.status).toBe(400);
    expect(error.details).toEqual(['name wajib diisi']);
  });

  it('melempar pesan umum jika respons bukan JSON', async () => {
    mockFetch({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error('bukan json');
      },
    });
    let error;
    try {
      await api.listProducts();
    } catch (e) {
      error = e;
    }
    expect(error.message).toBe('Permintaan gagal (502)');
    expect(error.details).toEqual([]);
  });
});
