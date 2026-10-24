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

const isDigits = (text) => text !== '' && [...text].every((c) => c >= '0' && c <= '9');

// '2026-10-22' -> '22 Oktober 2026'
export function formatDate(iso) {
  if (typeof iso !== 'string') return '-';
  const parts = iso.split('-');
  const [year, month, day] = parts;
  const validShape =
    parts.length === 3 &&
    year.length === 4 &&
    month.length === 2 &&
    day.length === 2 &&
    parts.every(isDigits);
  if (!validShape || !MONTHS[Number(month) - 1]) return '-';
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${Number(year)}`;
}

// 25000 -> 'Rp 25.000'
export function formatRupiah(value) {
  if (value === null || value === undefined || value === '') return '-';
  const text = String(Math.trunc(Number(value)));
  const negative = text.startsWith('-');
  const digits = negative ? text.slice(1) : text;
  if (!isDigits(digits)) return `Rp ${text}`;
  const groups = [];
  for (let end = digits.length; end > 0; end -= 3) {
    groups.unshift(digits.slice(Math.max(0, end - 3), end));
  }
  return `Rp ${negative ? '-' : ''}${groups.join('.')}`;
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
