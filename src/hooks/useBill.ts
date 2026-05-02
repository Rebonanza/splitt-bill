import { useBillContext } from '@/context/BillContext';
import type { Fee } from '@/types';
import type { ParsedReceiptItem } from '@/types';

export function useBill() {
  const { state, dispatch } = useBillContext();

  return {
    persons: state.persons,
    fees: state.fees,

    addPerson: () => dispatch({ type: 'ADD_PERSON' }),
    removePerson: (id: string) => dispatch({ type: 'REMOVE_PERSON', id }),
    updatePersonName: (id: string, name: string) =>
      dispatch({ type: 'UPDATE_PERSON_NAME', id, name }),

    addItem: (personId: string) => dispatch({ type: 'ADD_ITEM', personId }),
    updateItem: (
      personId: string,
      itemId: string,
      field: 'name' | 'price',
      value: string | number
    ) => dispatch({ type: 'UPDATE_ITEM', personId, itemId, field, value }),
    removeItem: (personId: string, itemId: string) =>
      dispatch({ type: 'REMOVE_ITEM', personId, itemId }),

    addFee: () => dispatch({ type: 'ADD_FEE' }),
    updateFee: (id: string, field: keyof Fee, value: unknown) =>
      dispatch({ type: 'UPDATE_FEE', id, field, value }),
    removeFee: (id: string) => dispatch({ type: 'REMOVE_FEE', id }),

    applyParsedReceipt: (personId: string, items: ParsedReceiptItem[]) =>
      dispatch({ type: 'APPLY_PARSED_RECEIPT', personId, items }),
    
    applyParsedMapping: (assignments: { personId: string; item: ParsedReceiptItem }[], fees: import('@/types').ParsedReceiptFee[]) =>
      dispatch({ type: 'APPLY_PARSED_MAPPING', assignments, fees }),
  };
}
