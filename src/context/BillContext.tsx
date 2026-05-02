import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { billReducer, type BillState, type BillAction } from './bill.reducer';
import { DEFAULT_FEES } from '@/lib/constants';
import type { Fee } from '@/types';

function createInitialState(): BillState {
  return {
    persons: [
      {
        id: crypto.randomUUID(),
        name: 'Person A',
        items: [{ id: crypto.randomUUID(), name: '', price: 0 }],
        colorIndex: 0,
      },
    ],
    fees: DEFAULT_FEES.map((f): Fee => ({ ...f, id: crypto.randomUUID() })),
  };
}

interface BillContextValue {
  state: BillState;
  dispatch: React.Dispatch<BillAction>;
  resetBill: () => void;
}

const BillContext = createContext<BillContextValue | null>(null);

export function BillProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(billReducer, undefined, createInitialState);

  const resetBill = () => {
    // Replace with fresh state — we do this by re-mounting trick via key
    // Actually we dispatch a synthetic reset by re-initializing
    const fresh = createInitialState();
    dispatch({ type: 'RESET_BILL' });
    // We re-init via a workaround: dispatch multiple actions. 
    // For simplicity, we expose resetBill which the consumer can use with a key.
    void fresh;
  };

  return (
    <BillContext.Provider value={{ state, dispatch, resetBill }}>
      {children}
    </BillContext.Provider>
  );
}

export function useBillContext() {
  const ctx = useContext(BillContext);
  if (!ctx) throw new Error('useBillContext must be used within BillProvider');
  return ctx;
}
