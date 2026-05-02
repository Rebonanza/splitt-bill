import { useBillSummary } from '@/hooks/useBillSummary';
import { PersonSummary } from './PersonSummary';
import { GrandTotalBar } from './GrandTotalBar';
import { ActionBar } from './ActionBar';
import { ReceiptSnapshot } from '../shared/ReceiptSnapshot';

export function SummaryPanel() {
  const summary = useBillSummary();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h2
          className="text-lg font-bold"
          style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}
        >
          Ringkasan
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {summary.persons.map((p) => (
          <PersonSummary
            key={p.id}
            person={p}
            showFeeShare={summary.netFees !== 0}
          />
        ))}
      </div>

      <GrandTotalBar total={summary.grandTotal} />

      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted text-center">
          Bagikan Hasil
        </span>
        <ActionBar />
      </div>

      <ReceiptSnapshot />
    </section>
  );
}
