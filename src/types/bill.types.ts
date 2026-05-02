// src/types/bill.types.ts

export interface Item {
  id: string;
  name: string;
  price: number;
}

export interface Person {
  id: string;
  name: string;
  items: Item[];
  colorIndex: number;
}

export type FeeType = 'add' | 'subtract';

export interface Fee {
  id: string;
  name: string;
  amount: number;
  type: FeeType;
  isDefault: boolean;
}

export interface PersonCalculation extends Person {
  subtotal: number;
  ratio: number;
  feeShare: number;
  total: number;
}

export interface BillSummary {
  persons: PersonCalculation[];
  grandSubtotal: number;
  totalAdditional: number;
  totalDeductions: number;
  netFees: number;
  grandTotal: number;
}
