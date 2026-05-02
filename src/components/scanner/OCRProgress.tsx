interface OCRProgressProps {
  progress: number;
  status: string;
}

export function OCRProgress({ progress, status }: OCRProgressProps) {
  const getStatusText = () => {
    switch (status) {
      case 'ocr-processing': return 'Membaca gambar (OCR)...';
      case 'ai-parsing': return 'Menganalisis item dengan AI...';
      default: return 'Selesai!';
    }
  };

  return (
    <div className="flex flex-col gap-4 py-8">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 animate-bounce items-center justify-center rounded-xl bg-accent text-accent-fg">
          ✨
        </div>
        <p className="text-sm font-medium animate-pulse-soft" style={{ color: 'var(--text)' }}>
          {getStatusText()}
        </p>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full bg-accent transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="text-center font-mono text-[10px] text-muted">
        {progress}% diproses
      </p>
    </div>
  );
}
