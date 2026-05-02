import { useState } from 'react';
import { formatCurrency } from '@/lib/formatters';
import { useBill } from '@/hooks/useBill';
import { COLORS } from '@/lib/constants';
import type { ParsedReceipt } from '@/types';

interface ParsedPreviewProps {
  result: ParsedReceipt;
  onApplied: () => void;
}

export function ParsedPreview({ result, onApplied }: ParsedPreviewProps) {
  const { persons, applyParsedReceipt } = useBill();
  const [selectedPersonId, setSelectedPersonId] = useState(persons[0]?.id || '');

  const handleApply = () => {
    if (!selectedPersonId) return;
    applyParsedReceipt(selectedPersonId, result.items);
    onApplied();
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold uppercase tracking-widest text-muted">
          Pilih Orang untuk Assign Item:
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {persons.map((p) => {
            const color = COLORS[p.colorIndex % COLORS.length];
            const isSelected = selectedPersonId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPersonId(p.id)}
                className={`flex flex-col items-center gap-1 rounded-xl p-3 border-2 transition-all ${
                  isSelected ? 'border-accent bg-accent/5' : 'border-transparent bg-surface-2 hover:bg-surface-2/80'
                }`}
              >
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs"
                  style={{ background: color.bg, color: color.text }}
                >
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] font-bold truncate w-full text-center" style={{ color: 'var(--text)' }}>
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-muted">
            Hasil Ekstraksi AI:
          </label>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            result.confidence === 'high' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
          }`}>
            Confidence: {result.confidence}
          </span>
        </div>
        
        <div
          className="max-h-[300px] overflow-y-auto rounded-xl border border-border bg-surface p-2"
        >
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/50 text-[10px] uppercase text-muted">
                <th className="pb-2 pl-2">Item</th>
                <th className="pb-2 text-right pr-2">Harga</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((item, idx) => (
                <tr key={idx} className="border-b border-border/10 last:border-0">
                  <td className="py-2 pl-2 text-xs" style={{ color: 'var(--text)' }}>{item.name}</td>
                  <td className="py-2 text-right pr-2 font-mono text-xs" style={{ color: 'var(--text)' }}>
                    {formatCurrency(item.price)}
                  </td>
                </tr>
              ))}
              {result.items.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-xs text-muted">
                    Tidak ada item terbaca.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={handleApply}
        disabled={!selectedPersonId || result.items.length === 0}
        className="w-full rounded-xl py-4 font-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
      >
        Masukkan ke {persons.find(p => p.id === selectedPersonId)?.name}
      </button>
    </div>
  );
}
