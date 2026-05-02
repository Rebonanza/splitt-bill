import { useMemo } from 'react';
import { useBillContext } from '@/context/BillContext';
import { calculateBillSummary } from '@/lib/calculators';

export function useBillSummary() {
  const { state } = useBillContext();

  return useMemo(
    () => calculateBillSummary(state.persons, state.fees),
    [state.persons, state.fees]
  );
}
