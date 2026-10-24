export const CATEGORY_LABELS = {
  cleanser: 'Pembersih',
  toner: 'Toner',
  serum: 'Serum',
  moisturizer: 'Pelembap',
  sunscreen: 'Tabir Surya',
  mask: 'Masker',
  other: 'Lainnya',
};

export const CONDITION_LABELS = {
  great: 'Sangat baik',
  good: 'Baik',
  normal: 'Normal',
  dry: 'Kering',
  oily: 'Berminyak',
  breakout: 'Berjerawat',
  irritated: 'Iritasi',
};

export const TIME_LABELS = { morning: 'Pagi', night: 'Malam' };

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

// '2026-10-22' -> '22 Oktober 2026'
export function formatDate(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '-';
  const [year, month, day] = iso.split('-').map(Number);
  if (!MONTHS[month - 1]) return '-';
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

// 25000 -> 'Rp 25.000'
export function formatRupiah(value) {
  if (value === null || value === undefined || value === '') return '-';
  const digits = String(Math.trunc(Number(value)));
  return `Rp ${digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

// Status kedaluwarsa dari jumlah hari tersisa (days_left dari API)
export function expiryStatus(daysLeft) {
  if (daysLeft < 0) return { key: 'expired', label: 'Sudah kedaluwarsa' };
  if (daysLeft === 0) return { key: 'soon', label: 'Kedaluwarsa hari ini' };
  if (daysLeft <= 30) return { key: 'soon', label: `${daysLeft} hari lagi` };
  return { key: 'ok', label: 'Masih aman' };
}

export function todayISO(now = new Date()) {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// Ringkasan angka untuk kartu statistik di dashboard
export function summarize(products, routines) {
  return {
    totalProducts: products.length,
    expiringSoon: products.filter((p) => p.days_left >= 0 && p.days_left <= 30).length,
    expired: products.filter((p) => p.days_left < 0).length,
    totalEntries: routines.length,
  };
}

// 4 -> '★★★★☆'
export function ratingStars(rating) {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));
  return '★'.repeat(value) + '☆'.repeat(5 - value);
}
