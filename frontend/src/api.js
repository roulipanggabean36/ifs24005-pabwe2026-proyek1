const BASE = import.meta.env?.VITE_API_BASE_URL || '/api';

async function request(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // respons bukan JSON, ditangani di bawah
  }

  if (!response.ok || !payload || payload.success === false) {
    const error = new Error(payload?.message || `Permintaan gagal (${response.status})`);
    error.status = response.status;
    error.details = payload?.errors || [];
    throw error;
  }
  return payload.data;
}

function query(params = {}) {
  const entries = Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined);
  const text = new URLSearchParams(entries).toString();
  return text ? `?${text}` : '';
}

export const api = {
  listProducts: (params) => request(`/products${query(params)}`),
  createProduct: (body) => request('/products', { method: 'POST', body }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  listRoutines: (params) => request(`/routines${query(params)}`),
  createRoutine: (body) => request('/routines', { method: 'POST', body }),
  updateRoutine: (id, body) => request(`/routines/${id}`, { method: 'PUT', body }),
  deleteRoutine: (id) => request(`/routines/${id}`, { method: 'DELETE' }),
};
