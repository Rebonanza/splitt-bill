import type { Person, Fee, Item } from '@/types';
import type { ParsedReceiptItem } from '@/types';

export interface BillState {
  persons: Person[];
  fees: Fee[];
}

export type BillAction =
  | { type: 'ADD_PERSON' }
  | { type: 'REMOVE_PERSON'; id: string }
  | { type: 'UPDATE_PERSON_NAME'; id: string; name: string }
  | { type: 'ADD_ITEM'; personId: string }
  | { type: 'UPDATE_ITEM'; personId: string; itemId: string; field: 'name' | 'price'; value: string | number }
  | { type: 'REMOVE_ITEM'; personId: string; itemId: string }
  | { type: 'ADD_FEE' }
  | { type: 'UPDATE_FEE'; id: string; field: keyof Fee; value: unknown }
  | { type: 'REMOVE_FEE'; id: string }
  | { type: 'APPLY_PARSED_RECEIPT'; personId: string; items: ParsedReceiptItem[] }
  | { type: 'RESET_BILL' };

function createItem(): Item {
  return { id: crypto.randomUUID(), name: '', price: 0 };
}

export function billReducer(state: BillState, action: BillAction): BillState {
  switch (action.type) {
    case 'ADD_PERSON': {
      const colorIndex = state.persons.length % 8;
      const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      const label = labels[state.persons.length] ?? String(state.persons.length + 1);
      const newPerson: Person = {
        id: crypto.randomUUID(),
        name: `Person ${label}`,
        items: [createItem()],
        colorIndex,
      };
      return { ...state, persons: [...state.persons, newPerson] };
    }

    case 'REMOVE_PERSON': {
      if (state.persons.length <= 1) return state; // guard — handled by toast in UI
      return { ...state, persons: state.persons.filter((p) => p.id !== action.id) };
    }

    case 'UPDATE_PERSON_NAME': {
      return {
        ...state,
        persons: state.persons.map((p) =>
          p.id === action.id ? { ...p, name: action.name } : p
        ),
      };
    }

    case 'ADD_ITEM': {
      return {
        ...state,
        persons: state.persons.map((p) =>
          p.id === action.personId ? { ...p, items: [...p.items, createItem()] } : p
        ),
      };
    }

    case 'UPDATE_ITEM': {
      return {
        ...state,
        persons: state.persons.map((p) =>
          p.id === action.personId
            ? {
                ...p,
                items: p.items.map((item) =>
                  item.id === action.itemId
                    ? { ...item, [action.field]: action.value }
                    : item
                ),
              }
            : p
        ),
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        persons: state.persons.map((p) => {
          if (p.id !== action.personId) return p;
          if (p.items.length <= 1) return p; // guard
          return { ...p, items: p.items.filter((item) => item.id !== action.itemId) };
        }),
      };
    }

    case 'ADD_FEE': {
      const newFee: Fee = {
        id: crypto.randomUUID(),
        name: 'Custom Fee',
        amount: 0,
        type: 'add',
        isDefault: false,
      };
      return { ...state, fees: [...state.fees, newFee] };
    }

    case 'UPDATE_FEE': {
      return {
        ...state,
        fees: state.fees.map((f) =>
          f.id === action.id ? { ...f, [action.field]: action.value } : f
        ),
      };
    }

    case 'REMOVE_FEE': {
      return { ...state, fees: state.fees.filter((f) => f.id !== action.id || f.isDefault) };
    }

    case 'APPLY_PARSED_RECEIPT': {
      return {
        ...state,
        persons: state.persons.map((p) => {
          if (p.id !== action.personId) return p;
          const newItems: Item[] = action.items.map((i) => ({
            id: crypto.randomUUID(),
            name: i.name,
            price: i.price,
          }));
          // Remove blank placeholder items, then append
          const existingNonBlank = p.items.filter((item) => item.name.trim() || item.price > 0);
          return { ...p, items: [...existingNonBlank, ...newItems] };
        }),
      };
    }

    case 'RESET_BILL':
      return state; // actual reset handled by re-initializing from outside

    default:
      return state;
  }
}
