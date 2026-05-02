import { useState, useCallback } from 'react';
import type { GeminiParseStatus, ParsedReceipt } from '@/types';

interface UseOCRReturn {
  scan: (imageFile: File) => Promise<string>;
  progress: number;
  status: GeminiParseStatus;
  isLoading: boolean;
  error: string | null;
}

export function useOCR(): UseOCRReturn {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<GeminiParseStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(async (imageFile: File): Promise<string> => {
    setStatus('ocr-processing');
    setProgress(0);
    setError(null);

    try {
      // Lazy load Tesseract to avoid bloating initial bundle
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng+ind', 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const result = await worker.recognize(imageFile);
      await worker.terminate();

      setProgress(100);
      setStatus('idle');
      return result.data.text;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'OCR gagal';
      setError(msg);
      setStatus('error');
      throw err;
    }
  }, []);

  return { scan, progress, status, isLoading: status === 'ocr-processing', error };
}

export function useGeminiParser() {
  const [status, setStatus] = useState<GeminiParseStatus>('idle');
  const [result, setResult] = useState<ParsedReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState('');

  const { scan, progress: ocrProgress } = useOCR();

  const parse = useCallback(
    async (imageFile: File): Promise<ParsedReceipt | null> => {
      try {
        // Step 1: OCR
        setStatus('ocr-processing');
        const text = await scan(imageFile);
        setRawText(text);

        // Step 2: Gemini AI parsing
        setStatus('ai-parsing');
        const { callGeminiAPI } = await import('@/services/gemini.service');
        const parsed = await callGeminiAPI(text);
        setResult(parsed);
        setStatus('done');
        return parsed;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Parsing gagal';
        setError(msg);
        setStatus('error');
        return null;
      }
    },
    [scan]
  );

  const reset = () => {
    setStatus('idle');
    setResult(null);
    setError(null);
    setRawText('');
  };

  return { parse, status, result, error, rawText, ocrProgress, reset };
}
