import { formatCurrency, formatPercent } from '@/lib/formatters';
import { COLORS } from '@/lib/constants';
import type { PersonCalculation } from '@/types';

interface PersonSummaryProps {
  person: PersonCalculation;
  showFeeShare: boolean;
}

export function PersonSummary({ person, showFeeShare }: PersonSummaryProps) {
  const color = COLORS[person.colorIndex % COLORS.length];
  const validItems = person.items.filter((item) => item.name.trim() || item.price > 0);

  return (
    <div
      className="flex flex-col gap-3 rounded-xl p-4 animate-slide-up"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Person header */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
          style={{ background: color.bg, color: color.text }}
        >
          {person.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-1 items-center justify-between gap-2">
          <span className="font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>
            {person.name}
          </span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {formatPercent(person.ratio)}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-1">
        {validItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>{item.name || 'Item'}</span>
            <span
              className="text-sm"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text)' }}
            >
              {formatCurrency(item.price)}
            </span>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      {validItems.length > 1 && (
        <div className="flex items-center justify-between border-t pt-2" style={{ borderColor: 'var(--border)' }}>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>Subtotal</span>
          <span
            className="text-sm"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text)' }}
          >
            {formatCurrency(person.subtotal)}
          </span>
        </div>
      )}

      {/* Fee share */}
      {showFeeShare && person.feeShare !== 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {person.feeShare > 0 ? 'Biaya tambahan' : 'Potongan'}
          </span>
          <span
            className="text-sm"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              color: person.feeShare > 0 ? 'var(--danger)' : 'var(--success)',
            }}
          >
            {person.feeShare > 0 ? '+' : ''}{formatCurrency(person.feeShare)}
          </span>
        </div>
      )}

      {/* Total */}
      <div
        className="flex items-center justify-between rounded-lg px-3 py-2"
        style={{ background: 'var(--surface-2)' }}
      >
        <span className="font-semibold" style={{ color: 'var(--text)' }}>Total</span>
        <span
          className="text-lg font-bold"
          style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)' }}
        >
          {formatCurrency(person.total)}
        </span>
      </div>
    </div>
  );
}
