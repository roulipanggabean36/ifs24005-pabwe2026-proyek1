import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatRupiah,
  expiryStatus,
  todayISO,
  summarize,
  ratingStars,
} from '../src/utils/format.js';

describe('formatDate', () => {
  it('mengubah ISO menjadi tanggal Indonesia', () => {
    expect(formatDate('2026-10-22')).toBe('22 Oktober 2026');
    expect(formatDate('2027-01-05')).toBe('5 Januari 2027');
  });

  it('mengembalikan tanda strip untuk nilai tidak valid', () => {
    expect(formatDate(null)).toBe('-');
    expect(formatDate('kemarin')).toBe('-');
    expect(formatDate('2026-13-01')).toBe('-');
  });
});

describe('formatRupiah', () => {
  it('memberi pemisah ribuan', () => {
    expect(formatRupiah(25000)).toBe('Rp 25.000');
    expect(formatRupiah(1250000)).toBe('Rp 1.250.000');
    expect(formatRupiah(0)).toBe('Rp 0');
  });

  it('mengembalikan tanda strip jika harga kosong', () => {
    expect(formatRupiah(null)).toBe('-');
    expect(formatRupiah(undefined)).toBe('-');
    expect(formatRupiah('')).toBe('-');
  });
});

describe('expiryStatus', () => {
  it('membedakan kedaluwarsa, segera, dan aman', () => {
    expect(expiryStatus(-1).key).toBe('expired');
    expect(expiryStatus(0).key).toBe('soon');
    expect(expiryStatus(0).label).toBe('Kedaluwarsa hari ini');
    expect(expiryStatus(12)).toEqual({ key: 'soon', label: '12 hari lagi' });
    expect(expiryStatus(30).key).toBe('soon');
    expect(expiryStatus(31).key).toBe('ok');
  });
});

describe('todayISO', () => {
  it('memakai tanggal lokal dengan nol di depan', () => {
    expect(todayISO(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(todayISO(new Date(2026, 11, 31))).toBe('2026-12-31');
    expect(todayISO()).toHaveLength(10);
  });
});

describe('summarize', () => {
  it('menghitung ringkasan dashboard', () => {
    const products = [{ days_left: -3 }, { days_left: 5 }, { days_left: 30 }, { days_left: 200 }];
    expect(summarize(products, [{}, {}])).toEqual({
      totalProducts: 4,
      expiringSoon: 2,
      expired: 1,
      totalEntries: 2,
    });
  });
});

describe('ratingStars', () => {
  it('membuat bintang sesuai nilai dan membatasi 0 sampai 5', () => {
    expect(ratingStars(4)).toBe('★★★★☆');
    expect(ratingStars(9)).toBe('★★★★★');
    expect(ratingStars(null)).toBe('☆☆☆☆☆');
  });
});
