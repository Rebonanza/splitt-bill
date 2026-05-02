import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-2.5-flash-lite';

const SYSTEM_PROMPT = `
Kamu adalah parser struk belanja Indonesia (terutama platform seperti ShopeeFood, GoFood, GrabFood, atau struk restoran).
Dari teks OCR berikut, ekstrak:
1. Daftar item menu: nama item dan harga total item tersebut.
2. Daftar biaya tambahan & diskon (pajak, biaya layanan, biaya pengiriman/ongkir, voucher, diskon, dll).

Aturan:
- Abaikan subtotal dan grand total (saya akan hitung sendiri).
- Normalisasi harga: hilangkan simbol mata uang, titik, atau koma. Return angka integer.
- Untuk Voucher, Diskon, atau Potongan harga, berikan harga NEGATIF (contoh: -24800).
- Masukkan semua biaya (ongkir, layanan, dll) dan potongan (voucher) ke dalam array "fees".
- Pastikan nama item bersih dari angka kuantitas di depan (contoh: "1 x Bangor Juragan" jadi "Bangor Juragan").

Kembalikan HANYA JSON valid sesuai skema ini:
{ 
  "items": [{ "name": string, "price": number }],
  "fees": [{ "name": string, "price": number, "type": "add" | "subtract" }]
}
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ocrText } = req.body;

  if (!ocrText) {
    return res.status(400).json({ error: 'ocrText is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API Key is not configured on server' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const prompt = `${SYSTEM_PROMPT}\n\nTeks OCR:\n${ocrText}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const parsed = JSON.parse(text);

    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Gemini Server Error:', error);
    return res.status(500).json({
      error: 'Failed to parse receipt with Gemini AI',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
