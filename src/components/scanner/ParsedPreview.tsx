import { useState } from 'react';
import { formatCurrency } from '@/lib/formatters';
import { useBill } from '@/hooks/useBill';
import { COLORS } from '@/lib/constants';
import type { ParsedReceipt } from '@/types';
import { Check, UserPlus } from 'lucide-react';

interface ParsedPreviewProps {
  result: ParsedReceipt;
  onApplied: () => void;
}

export function ParsedPreview({ result, onApplied }: ParsedPreviewProps) {
  const { persons, applyParsedMapping, addPerson } = useBill();
  
  // Start with empty assignments so user MUST pick manually
  const [assignments, setAssignments] = useState<Record<number, string>>({});

  const isAllAssigned = result.items.length > 0 && 
    Object.keys(assignments).length === result.items.length &&
    Object.values(assignments).every(id => id !== '');

  const handleApply = () => {
    if (!isAllAssigned) return;

    const mapping = result.items.map((item, idx) => ({
      personId: assignments[idx],
      item,
    }));
    
    applyParsedMapping(mapping, result.fees || []);
    onApplied();
  };

  const toggleAssignment = (itemIdx: number, personId: string) => {
    setAssignments(prev => ({
      ...prev,
      [itemIdx]: personId
    }));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Items Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <label className="text-xs font-bold uppercase tracking-widest text-muted">
              Mapping Item per Orang:
            </label>
            {!isAllAssigned && result.items.length > 0 && (
              <span className="text-[10px] text-danger animate-pulse">Pilih orang untuk setiap item</span>
            )}
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            result.confidence === 'high' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
          }`}>
            Confidence: {result.confidence}
          </span>
        </div>
        
        <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto pr-1">
          {result.items.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-2 rounded-xl border border-border bg-surface-2/30 p-3 transition-all">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>{item.name}</span>
                <span className="text-xs font-mono font-bold text-accent">{formatCurrency(item.price)}</span>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mt-1">
                {persons.map((p) => {
                  const isAssigned = assignments[idx] === p.id;
                  const color = COLORS[p.colorIndex % COLORS.length];
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleAssignment(idx, p.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-bold transition-all border ${
                        isAssigned 
                          ? 'border-accent bg-accent/10 text-accent ring-1 ring-accent/20' 
                          : 'border-border/50 bg-surface hover:bg-surface-2 text-muted'
                      }`}
                    >
                      <div 
                        className="h-4 w-4 rounded-md flex items-center justify-center text-[8px]" 
                        style={{ background: isAssigned ? 'var(--accent)' : color.bg, color: isAssigned ? 'var(--accent-fg)' : color.text }}
                      >
                        {isAssigned ? <Check size={8} /> : p.name.charAt(0).toUpperCase()}
                      </div>
                      {p.name}
                    </button>
                  );
                })}
                
                {/* Quick Add Person Button */}
                <button
                  onClick={addPerson}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold border border-dashed border-border/50 text-muted hover:bg-surface-2 hover:text-text transition-all"
                >
                  <UserPlus size={10} />
                  Tambah
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fees Summary */}
      {result.fees && result.fees.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted">
            Biaya Tambahan & Diskon (Shared):
          </label>
          <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-surface-2/20 p-3">
            {result.fees.map((fee, idx) => (
              <div key={idx} className="flex items-center justify-between text-[10px]">
                <span className="text-muted">{fee.name}</span>
                <span className={`font-mono font-bold ${fee.price < 0 ? 'text-success' : 'text-danger'}`}>
                  {fee.price < 0 ? '-' : '+'}{formatCurrency(Math.abs(fee.price))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleApply}
        disabled={result.items.length === 0}
        className="w-full rounded-2xl py-4 font-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ background: 'var(--accent)', color: 'var(--accent-fg)', fontFamily: 'Syne, sans-serif' }}
      >
        <UserPlus size={18} />
        Terapkan ke Bill
      </button>
    </div>
  );
}
