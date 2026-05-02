import { Download, Share2, Copy } from 'lucide-react';
import { useShareExport } from '@/hooks/useShareExport';

export function ActionBar() {
  const { downloadImage, shareWhatsApp, copyText } = useShareExport();

  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={downloadImage}
        className="flex flex-col items-center justify-center gap-1 rounded-xl py-3 text-[10px] font-bold uppercase transition-all hover:brightness-95 active:scale-95"
        style={{
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
        }}
      >
        <Download size={18} />
        <span>Simpan</span>
      </button>

      <button
        onClick={shareWhatsApp}
        className="flex flex-col items-center justify-center gap-1 rounded-xl py-3 text-[10px] font-bold uppercase transition-all hover:brightness-95 active:scale-95"
        style={{
          background: '#25D366',
          color: '#fff',
          border: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <Share2 size={18} />
        <span>WhatsApp</span>
      </button>

      <button
        onClick={copyText}
        className="flex flex-col items-center justify-center gap-1 rounded-xl py-3 text-[10px] font-bold uppercase transition-all hover:brightness-95 active:scale-95"
        style={{
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
        }}
      >
        <Copy size={18} />
        <span>Salin</span>
      </button>
    </div>
  );
}
