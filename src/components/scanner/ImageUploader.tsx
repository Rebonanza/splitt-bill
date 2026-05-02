import { useRef, useState } from 'react';
import { Upload, Camera, FileImage } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export function ImageUploader({ onFileSelect, isLoading }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Hanya file gambar yang didukung');
      return;
    }
    onFileSelect(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLoading) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed py-12 transition-all ${
        isDragging ? 'border-accent bg-accent/5 scale-[1.02]' : 'border-border bg-surface-2/50'
      } ${isLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:border-accent hover:bg-accent/5'}`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Upload size={32} />
      </div>

      <div className="flex flex-col items-center text-center">
        <p className="font-bold" style={{ color: 'var(--text)' }}>
          Unggah Struk
        </p>
        <p className="text-xs text-muted">
          Tarik file ke sini atau klik untuk memilih
        </p>
      </div>

      <div className="flex items-center gap-6 mt-2">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Camera size={14} /> Kamera
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <FileImage size={14} /> Galeri / Screenshot
        </div>
      </div>
    </div>
  );
}
