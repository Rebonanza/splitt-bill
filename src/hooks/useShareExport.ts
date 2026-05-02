import { useCallback } from 'react';
import { useBillSummary } from './useBillSummary';
import { useBill } from './useBill';
import { formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';

export function useShareExport() {
  const summary = useBillSummary();
  const { persons } = useBill();

  const buildText = useCallback((): string => {
    const lines: string[] = ['🧾 *SplitBill Summary*\n'];

    summary.persons.forEach((p) => {
      lines.push(`*${p.name}*`);
      p.items
        .filter((item) => item.name.trim() || item.price > 0)
        .forEach((item) => {
          lines.push(`  • ${item.name || 'Item'}: ${formatCurrency(item.price)}`);
        });
      if (summary.netFees !== 0) {
        lines.push(`  _Fee share: ${formatCurrency(p.feeShare)}_`);
      }
      lines.push(`  *Total: ${formatCurrency(p.total)}*\n`);
    });

    lines.push(`*Grand Total: ${formatCurrency(summary.grandTotal)}*`);
    return lines.join('\n');
  }, [summary]);

  const downloadImage = useCallback(async () => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const el = document.getElementById('receipt-snapshot');
      if (!el) {
        toast.error('Snapshot element not found');
        return;
      }
      const canvas = await html2canvas(el, { 
        scale: 2, 
        backgroundColor: '#0f0f13', 
        useCORS: true,
        logging: true,
        imageTimeout: 0,
      });
      const link = document.createElement('a');
      link.download = `splitbill-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Gambar berhasil diunduh!');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Gagal mengunduh gambar. Silakan cek konsol browser.');
    }
  }, []);

  const shareWhatsApp = useCallback(() => {
    const text = buildText();
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }, [buildText]);

  const copyText = useCallback(async () => {
    try {
      const text = buildText();
      await navigator.clipboard.writeText(text);
      toast.success('Tersalin! ✓');
    } catch {
      toast.error('Gagal menyalin teks');
    }
  }, [buildText]);

  return { downloadImage, shareWhatsApp, copyText, buildText, persons };
}
