import * as Dialog from '@radix-ui/react-dialog';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { useGeminiParser } from '@/hooks/useOCR';
import { ImageUploader } from './ImageUploader';
import { OCRProgress } from './OCRProgress';
import { ParsedPreview } from './ParsedPreview';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScannerModal({ isOpen, onClose }: ScannerModalProps) {
  const { parse, status, result, error, ocrProgress, reset } = useGeminiParser();

  const handleFileSelect = async (file: File) => {
    await parse(file);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-2xl animate-slide-up"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Sparkles size={18} />
              </div>
              <Dialog.Title className="text-lg font-bold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>
                Smart Scanner
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                className="rounded-lg p-2 text-muted transition-all hover:bg-surface-2 hover:text-text"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex flex-col gap-6">
            {status === 'idle' && (
              <>
                <p className="text-sm text-muted">
                  Unggah foto struk atau screenshot untuk mengekstrak item secara otomatis menggunakan Gemini AI.
                </p>
                <ImageUploader onFileSelect={handleFileSelect} isLoading={false} />
              </>
            )}

            {(status === 'ocr-processing' || status === 'ai-parsing') && (
              <OCRProgress progress={ocrProgress} status={status} />
            )}

            {status === 'done' && result && (
              <ParsedPreview result={result} onApplied={handleClose} />
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
                  <AlertCircle size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-danger">Terjadi Kesalahan</p>
                  <p className="text-xs text-muted max-w-[200px]">{error}</p>
                </div>
                <button
                  onClick={reset}
                  className="rounded-lg px-4 py-2 text-sm font-bold bg-surface-2 hover:bg-border transition-all"
                  style={{ color: 'var(--text)' }}
                >
                  Coba Lagi
                </button>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
