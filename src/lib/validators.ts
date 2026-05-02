export function isValidPrice(value: unknown): boolean {
  if (typeof value === 'number') return value >= 0 && isFinite(value);
  if (typeof value === 'string') {
    const num = parseFloat(value.replace(/[^\d.]/g, ''));
    return !isNaN(num) && num >= 0;
  }
  return false;
}

export function isNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}
