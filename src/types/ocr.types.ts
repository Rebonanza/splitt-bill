// src/types/ocr.types.ts

export interface OCRResult {
  text: string;
  confidence: number; // 0–100
}

export interface ParsedReceiptItem {
  name: string;
  price: number;
}

export interface ParsedReceipt {
  items: ParsedReceiptItem[];
  rawText: string;
  confidence: 'high' | 'medium' | 'low';
}

export type GeminiParseStatus =
  | 'idle'
  | 'ocr-processing'
  | 'ai-parsing'
  | 'done'
  | 'error';
