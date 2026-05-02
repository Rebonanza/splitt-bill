import type { Person, Fee, BillSummary, PersonCalculation } from '@/types';

export function calculateBillSummary(persons: Person[], fees: Fee[]): BillSummary {
  const grandSubtotal = persons.reduce((sum, person) => {
    const personSubtotal = person.items.reduce((s, item) => {
      const isBlank = !item.name.trim() && item.price === 0;
      return isBlank ? s : s + item.price;
    }, 0);
    return sum + personSubtotal;
  }, 0);

  const totalAdditional = fees
    .filter((f) => f.type === 'add')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalDeductions = fees
    .filter((f) => f.type === 'subtract')
    .reduce((sum, f) => sum + f.amount, 0);

  const netFees = totalAdditional - totalDeductions;
  const grandTotal = grandSubtotal + netFees;

  const calculatedPersons: PersonCalculation[] = persons.map((person) => {
    const subtotal = person.items.reduce((s, item) => {
      const isBlank = !item.name.trim() && item.price === 0;
      return isBlank ? s : s + item.price;
    }, 0);

    const ratio = grandSubtotal > 0 ? subtotal / grandSubtotal : persons.length > 0 ? 1 / persons.length : 0;
    const feeShare = netFees * ratio;
    const total = subtotal + feeShare;

    return { ...person, subtotal, ratio, feeShare, total };
  });

  return {
    persons: calculatedPersons,
    grandSubtotal,
    totalAdditional,
    totalDeductions,
    netFees,
    grandTotal,
  };
}
