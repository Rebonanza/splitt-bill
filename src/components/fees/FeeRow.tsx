import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useBill } from '@/hooks/useBill';
import { formatNumberWithSeparators, parseCurrencyInput } from '@/lib/formatters';
import type { Fee } from '@/types';

interface FeeRowProps {
  fee: Fee;
}

export function FeeRow({ fee }: FeeRowProps) {
  const { updateFee, removeFee } = useBill();
  const [displayAmount, setDisplayAmount] = useState(
    fee.amount > 0 ? formatNumberWithSeparators(fee.amount) : ''
  );

  const handleAmountBlur = () => {
    const numVal = parseCurrencyInput(displayAmount);
    updateFee(fee.id, 'amount', numVal);
    setDisplayAmount(numVal > 0 ? formatNumberWithSeparators(numVal) : '');
  };

  const handleAmountFocus = () => {
    // Keep separators during focus
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const numVal = parseCurrencyInput(rawVal);
    setDisplayAmount(formatNumberWithSeparators(numVal));
    updateFee(fee.id, 'amount', numVal);
  };

  const toggleType = () => {
    updateFee(fee.id, 'type', fee.type === 'add' ? 'subtract' : 'add');
  };

  const isAdd = fee.type === 'add';

  return (
    <div className="group flex items-center gap-3 animate-fade-in">
      {/* +/- toggle */}
      <button
        onClick={toggleType}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm transition-all hover:scale-110 hover:ring-2 active:scale-90 cursor-pointer shadow-sm"
        style={{
          background: isAdd ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
          color: isAdd ? 'var(--success)' : 'var(--danger)',
          border: `1px solid ${isAdd ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          // @ts-expect-error custom ring color
          '--tw-ring-color': isAdd ? 'var(--success)' : 'var(--danger)',
          '--tw-ring-offset-width': '0px',
        }}
        title={isAdd ? 'Biaya tambahan (Klik untuk ubah jadi Potongan)' : 'Potongan (Klik untuk ubah jadi Tambahan)'}
      >
        {isAdd ? <Plus size={14} /> : <Minus size={14} />}
      </button>

      {/* Fee name */}
      {fee.isDefault ? (
        <span
          className="flex-1 text-sm font-medium"
          style={{ color: 'var(--text)' }}
        >
          {fee.name}
        </span>
      ) : (
        <input
          type="text"
          value={fee.name}
          onChange={(e) => updateFee(fee.id, 'name', e.target.value)}
          className="min-w-0 flex-1 rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          }}
        />
      )}

      {/* Amount input */}
      <input
        type="text"
        inputMode="numeric"
        placeholder="0"
        value={displayAmount}
        onFocus={handleAmountFocus}
        onBlur={handleAmountBlur}
        onChange={handleAmountChange}
        className="min-w-0 flex-1 rounded-lg px-3 py-2 text-right text-sm outline-none"
        style={{
          background: 'var(--surface-2)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      />

      {/* Delete (non-default only) */}
      {!fee.isDefault ? (
        <button
          onClick={() => removeFee(fee.id)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg opacity-0 transition-all group-hover:opacity-100 hover:scale-105"
          style={{ color: 'var(--danger)' }}
          title="Hapus fee"
        >
          <Trash2 size={14} />
        </button>
      ) : (
        <div className="w-8 shrink-0" />
      )}
    </div>
  );
}
