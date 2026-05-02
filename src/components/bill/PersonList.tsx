import { useBill } from '@/hooks/useBill';
import { PersonCard } from './PersonCard';
import { AddPersonButton } from './AddPersonButton';

export function PersonList() {
  const { persons } = useBill();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h2
          className="text-lg font-bold"
          style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}
        >
          Pesanan
        </h2>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}
        >
          {persons.length} orang
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {persons.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            canDelete={persons.length > 1}
          />
        ))}
      </div>

      <AddPersonButton />
    </section>
  );
}
