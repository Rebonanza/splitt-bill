import { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Header } from '@/components/layout/Header';
import { PersonList } from '@/components/bill/PersonList';
import { FeeSection } from '@/components/fees/FeeSection';
import { SummaryPanel } from '@/components/summary/SummaryPanel';
import { ScannerModal } from '@/components/scanner/ScannerModal';
import { useBillContext } from '@/context/BillContext';
import { Toaster } from 'sonner';
import { ReceiptSnapshot } from '@/components/shared/ReceiptSnapshot';

export default function Home() {
  const { resetBill } = useBillContext();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleReset = () => {
    if (window.confirm('Hapus semua data dan mulai baru?')) {
      resetBill();
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Header onScanClick={() => setIsScannerOpen(true)} onReset={handleReset} />
      
      <PageWrapper>
        <div className="flex flex-col gap-10">
          {/* Main Input Section */}
          <PersonList />

          <div className="h-px bg-border/50" />

          {/* Fees Section */}
          <FeeSection />

          <div className="h-px bg-border/50" />

          {/* Result Section */}
          <SummaryPanel />
        </div>
      </PageWrapper>

      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      <ReceiptSnapshot />
      <Toaster position="top-center" richColors />
    </div>
  );
}
