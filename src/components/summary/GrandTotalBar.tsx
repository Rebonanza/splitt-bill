import { formatCurrency } from '@/lib/formatters';

interface GrandTotalBarProps {
  total: number;
}

export function GrandTotalBar({ total }: GrandTotalBarProps) {
  return (
    <div
      className="flex items-center justify-between rounded-xl p-5 animate-slide-up shadow-lg"
      style={{
        background: 'var(--accent)',
        color: 'var(--accent-fg)',
      }}
    >
      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-wider opacity-70">
          Grand Total
        </span>
        <span
          className="text-2xl font-black"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {formatCurrency(total)}
        </span>
      </div>
      <div className="flex flex-col items-end opacity-70">
        <span className="text-[10px] font-bold uppercase">Sudah Termasuk</span>
        <span className="text-[10px] font-bold uppercase">Biaya & Potongan</span>
      </div>
    </div>
  );
}
