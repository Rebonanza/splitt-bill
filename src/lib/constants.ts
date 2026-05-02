import type { Fee } from '@/types';

export const APP_NAME = 'SplitBill';

export const COLORS = [
  { bg: '#b5d400', text: '#1a1a0f', label: 'lime' },
  { bg: '#60a5fa', text: '#0a1628', label: 'blue' },
  { bg: '#f472b6', text: '#2d0a1e', label: 'pink' },
  { bg: '#fb923c', text: '#2d1200', label: 'orange' },
  { bg: '#a78bfa', text: '#160b2d', label: 'purple' },
  { bg: '#34d399', text: '#072015', label: 'emerald' },
  { bg: '#fbbf24', text: '#2d1e00', label: 'amber' },
  { bg: '#f87171', text: '#2d0303', label: 'red' },
];

export const DEFAULT_FEES: Omit<Fee, 'id'>[] = [
  { name: 'Delivery Fee', amount: 0, type: 'add', isDefault: true },
  { name: 'Admin Fee', amount: 0, type: 'add', isDefault: true },
  { name: 'Discount', amount: 0, type: 'subtract', isDefault: true },
];
