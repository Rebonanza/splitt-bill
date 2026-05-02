import { UserPlus } from 'lucide-react';
import { useBill } from '@/hooks/useBill';

export function AddPersonButton() {
  const { addPerson } = useBill();

  return (
    <button
      onClick={addPerson}
      className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-medium transition-all hover:scale-[1.01] hover:brightness-95 active:scale-[0.99]"
      style={{
        background: 'var(--surface)',
        color: 'var(--accent)',
        border: '2px dashed var(--accent)',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      <UserPlus size={18} />
      Tambah Orang
    </button>
  );
}
