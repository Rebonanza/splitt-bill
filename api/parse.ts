import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-2.5-flash-lite';

const SYSTEM_PROMPT = `
Kamu adalah parser struk belanja Indonesia.
Dari teks OCR berikut, ekstrak semua nama item dan harganya.
Abaikan total, subtotal, pajak, dan baris yang bukan item.
Normalisasi harga: hilangkan titik/koma pemisah ribuan, return angka integer.
Kembalikan HANYA JSON valid sesuai skema ini:
{ "items": [{ "name": string, "price": number }] }
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Hanya izinkan method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ocrText } = req.body;

  if (!ocrText) {
    return res.status(400).json({ error: 'ocrText is required' });
  }

  // Ambil API Key dari Environment Variable (Aman di sisi server)
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
    
    // Kembalikan hasil ke frontend
    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Gemini Server Error:', error);
    return res.status(500).json({ 
      error: 'Failed to parse receipt with Gemini AI',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
