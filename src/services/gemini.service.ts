import type { ParsedReceipt } from '@/types';

/**
 * Memanggil API Internal (/api/parse) yang kemudian akan memanggil Gemini.
 * Keuntungan: API Key aman di sisi server (Vercel) dan tidak bocor ke browser.
 */
export async function callGeminiAPI(ocrText: string): Promise<ParsedReceipt> {
  try {
    const response = await fetch('/api/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ocrText }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Server error');
    }

    const data = await response.json() as { items: { name: string; price: number }[], fees?: { name: string; price: number; type: 'add' | 'substract' }[] };

    return {
      items: data.items ?? [],
      fees: data.fees ?? [],
      rawText: ocrText,
      confidence: (data.items?.length ?? 0) > 0 ? 'high' : 'low',
    };
  } catch (error) {
    console.error('OCR Parsing Error:', error);

    // Fallback jika terjadi error
    return {
      items: [],
      rawText: ocrText,
      confidence: 'low',
    };
  }
}
