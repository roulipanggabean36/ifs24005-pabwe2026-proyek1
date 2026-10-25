import { describe, it, expect } from 'vitest';
import { formatDate, formatRupiah } from '../src/utils/format.js';

describe('formatDate (kasus tepi)', () => {
  it('menolak format yang salah panjang atau bukan angka', () => {
    expect(formatDate('2026-1-01')).toBe('-');
    expect(formatDate('2026-10-2x')).toBe('-');
    expect(formatDate('26-10-22')).toBe('-');
    expect(formatDate('')).toBe('-');
    expect(formatDate('2026-10-22-01')).toBe('-');
  });
});

describe('formatRupiah (kasus tepi)', () => {
  it('menangani angka kecil, negatif, desimal, dan bukan angka', () => {
    expect(formatRupiah(123)).toBe('Rp 123');
    expect(formatRupiah(1000)).toBe('Rp 1.000');
    expect(formatRupiah(-25000)).toBe('Rp -25.000');
    expect(formatRupiah(1234.9)).toBe('Rp 1.234');
    expect(formatRupiah('abc')).toBe('Rp NaN');
  });
});