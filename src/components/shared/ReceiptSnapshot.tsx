import { formatCurrency, formatPercent } from '@/lib/formatters';
import { useBillSummary } from '@/hooks/useBillSummary';

export function ReceiptSnapshot() {
  const summary = useBillSummary();

  // Standard HEX colors to avoid html2canvas oklab/oklch errors
  const colors = {
    bg: '#0f0f13',
    text: '#ffffff',
    accent: '#b5d400',
    accentFg: '#000000',
    muted: '#88888e',
    border: '#2a2a2e',
  };

  return (
    <div
      id="receipt-snapshot"
      className="absolute top-0 -z-50 pointer-events-none w-[400px] p-8"
      style={{
        background: colors.bg,
        color: colors.text,
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <img
          src="/logo.webp"
          alt="Logo"
          className="h-14 w-14 rounded-2xl object-cover shadow-lg"
          style={{ border: `1px solid ${colors.border}` }}
        />
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Syne, sans-serif', color: colors.text }}>
            SplitBill
          </h1>
          <p className="text-sm" style={{ color: colors.muted }}>
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="my-6" style={{ borderBottom: `1px dashed ${colors.border}` }} />

      <div className="flex flex-col gap-6">
        {summary.persons.map((p) => (
          <div key={p.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-bold" style={{ color: colors.text }}>{p.name}</span>
              <span className="text-xs" style={{ color: colors.muted }}>{formatPercent(p.ratio)}</span>
            </div>
            {p.items
              .filter((i) => i.name.trim() || i.price > 0)
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between pl-2 text-sm" style={{ color: colors.text, opacity: 0.8 }}>
                  <span>{item.name || 'Item'}</span>
                  <span className="font-mono">{formatCurrency(item.price)}</span>
                </div>
              ))}
            {summary.netFees !== 0 && (
              <div className="flex items-center justify-between pl-2 text-xs italic" style={{ color: colors.muted }}>
                <span>Fee share</span>
                <span className="font-mono">{formatCurrency(p.feeShare)}</span>
              </div>
            )}
            <div className="mt-1 flex items-center justify-between pt-1 font-bold" style={{ borderTop: `1px solid ${colors.border}44` }}>
              <span style={{ color: colors.text }}>Total</span>
              <span className="font-mono" style={{ color: colors.accent }}>{formatCurrency(p.total)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="my-6" style={{ borderBottom: `1px dashed ${colors.border}` }} />

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-sm" style={{ color: colors.muted }}>
          <span>Subtotal</span>
          <span className="font-mono">{formatCurrency(summary.grandSubtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm" style={{ color: colors.muted }}>
          <span>Fees & Discounts</span>
          <span className="font-mono">{formatCurrency(summary.netFees)}</span>
        </div>
        <div 
          className="mt-6 flex items-center justify-between rounded-2xl p-6 font-black shadow-lg"
          style={{ background: colors.accent, color: colors.accentFg }}
        >
          <span className="text-sm uppercase tracking-wider">Grand Total</span>
          <span className="font-mono text-2xl">{formatCurrency(summary.grandTotal)}</span>
        </div>
      </div>

      <div className="mt-8 text-center text-[10px] uppercase tracking-widest" style={{ color: colors.muted }}>
        Created with SplitBill App
      </div>
    </div>
  );
}
