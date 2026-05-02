import { Plus } from 'lucide-react';
import { useBill } from '@/hooks/useBill';
import { FeeRow } from './FeeRow';

export function FeeSection() {
  const { fees, addFee } = useBill();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-bold"
          style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}
        >
          Biaya Tambahan
        </h2>
      </div>

      <div
        className="flex flex-col gap-3 rounded-xl p-4"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Column headers */}
        <div className="flex items-center gap-3 pb-1">
          <div className="w-8" />
          <span className="flex-1 text-xs" style={{ color: 'var(--muted)' }}>Keterangan</span>
          <span className="flex-1 text-right text-xs" style={{ color: 'var(--muted)' }}>Jumlah</span>
          <div className="w-8" />
        </div>

        {fees.map((fee) => (
          <FeeRow key={fee.id} fee={fee} />
        ))}

        <button
          onClick={addFee}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:brightness-95"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--muted)',
            border: '1px dashed var(--border)',
          }}
        >
          <Plus size={14} />
          Tambah fee kustom
        </button>
      </div>
    </section>
  );
}
