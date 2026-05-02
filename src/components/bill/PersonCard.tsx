import { useRef } from 'react';
import { Plus, Trash2, UserRound, Pencil } from 'lucide-react';
import { useBill } from '@/hooks/useBill';
import { COLORS } from '@/lib/constants';
import { ItemRow } from './ItemRow';
import { toast } from 'sonner';
import type { Person } from '@/types';

interface PersonCardProps {
  person: Person;
  canDelete: boolean;
}

export function PersonCard({ person, canDelete }: PersonCardProps) {
  const { updatePersonName, addItem, removePerson } = useBill();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const color = COLORS[person.colorIndex % COLORS.length];

  const handleDelete = () => {
    if (!canDelete) {
      toast.error('Minimal harus ada 1 orang!');
      return;
    }
    removePerson(person.id);
  };

  return (
    <div
      className="flex flex-col gap-3 rounded-xl p-4 transition-all animate-slide-up"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* Card Header */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: color.bg }}
        >
          <UserRound size={16} style={{ color: color.text }} />
        </div>

        <div className="group/name flex flex-1 items-center gap-2">
          <input
            ref={nameInputRef}
            type="text"
            value={person.name}
            onChange={(e) => updatePersonName(person.id, e.target.value)}
            placeholder="Nama..."
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none rounded hover:bg-surface-2/50 px-1 -ml-1 transition-colors cursor-text"
            style={{
              fontFamily: 'Syne, sans-serif',
              color: 'var(--text)',
              fontSize: '0.95rem',
            }}
          />
          <span className="opacity-0 group-hover/name:opacity-50 transition-opacity">
            <Pencil size={12} style={{ color: 'var(--muted)' }} />
          </span>
        </div>

        <button
          onClick={handleDelete}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all hover:scale-105 active:scale-95"
          style={{
            color: canDelete ? 'var(--danger)' : 'var(--border)',
            background: 'var(--surface-2)',
          }}
          title="Hapus orang"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Header labels */}
      <div className="flex items-center gap-2 px-0">
        <span className="flex-1 text-xs" style={{ color: 'var(--muted)' }}>Item</span>
        <span className="flex-1 text-right text-xs" style={{ color: 'var(--muted)' }}>Harga</span>
        <div className="w-8" />
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {person.items.map((item) => (
          <ItemRow
            key={item.id}
            personId={person.id}
            itemId={item.id}
            name={item.name}
            price={item.price}
            canDelete={person.items.length > 1}
          />
        ))}
      </div>

      {/* Add item */}
      <button
        onClick={() => addItem(person.id)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:brightness-95 active:scale-98"
        style={{
          background: 'var(--surface-2)',
          color: 'var(--muted)',
          border: '1px dashed var(--border)',
        }}
      >
        <Plus size={14} />
        Tambah item
      </button>
    </div>
  );
}
