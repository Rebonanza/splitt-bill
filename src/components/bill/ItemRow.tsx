import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useBill } from '@/hooks/useBill';
import { formatNumberWithSeparators, parseCurrencyInput } from '@/lib/formatters';

interface ItemRowProps {
  personId: string;
  itemId: string;
  name: string;
  price: number;
  canDelete: boolean;
}

export function ItemRow({ personId, itemId, name, price, canDelete }: ItemRowProps) {
  const { updateItem, removeItem } = useBill();
  const [displayPrice, setDisplayPrice] = useState(
    price > 0 ? formatNumberWithSeparators(price) : ''
  );

  const handlePriceBlur = () => {
    const numVal = parseCurrencyInput(displayPrice);
    updateItem(personId, itemId, 'price', numVal);
    setDisplayPrice(numVal > 0 ? formatNumberWithSeparators(numVal) : '');
  };

  const handlePriceFocus = () => {
    // Keep separators during focus too for consistency
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const numVal = parseCurrencyInput(rawVal);
    setDisplayPrice(formatNumberWithSeparators(numVal));
    updateItem(personId, itemId, 'price', numVal);
  };

  return (
    <div
      className="group flex items-center gap-2 animate-fade-in"
      style={{ animationDuration: '0.2s' }}
    >
      <input
        type="text"
        placeholder="Nama item..."
        value={name}
        onChange={(e) => updateItem(personId, itemId, 'name', e.target.value)}
        className="min-w-0 flex-1 rounded-lg px-3 py-2 text-sm outline-none transition-all focus:ring-2"
        style={{
          background: 'var(--surface-2)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          fontFamily: 'DM Sans, sans-serif',
          // @ts-expect-error css variable
          '--tw-ring-color': 'var(--accent)',
        }}
      />
      <input
        type="text"
        inputMode="numeric"
        placeholder="0"
        value={displayPrice}
        onFocus={handlePriceFocus}
        onBlur={handlePriceBlur}
        onChange={handlePriceChange}
        className="min-w-0 flex-1 rounded-lg px-3 py-2 text-right text-sm outline-none transition-all focus:ring-2"
        style={{
          background: 'var(--surface-2)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      />
      {canDelete && (
        <button
          onClick={() => removeItem(personId, itemId)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg opacity-0 transition-all group-hover:opacity-100 hover:scale-105 active:scale-95"
          style={{
            color: 'var(--danger)',
            background: 'transparent',
          }}
          title="Hapus item"
        >
          <Trash2 size={14} />
        </button>
      )}
      {!canDelete && <div className="w-8 shrink-0" />}
    </div>
  );
}
