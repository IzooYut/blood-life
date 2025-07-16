export const formatNumberWithCommas = (value: string | number): string => {
  const num = parseFloat(String(value).replace(/,/g, ''));
  if (isNaN(num)) return '';
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 10 });
};

export const sanitizeNumber = (value: string | number): string => {
  return Number(String(value).replace(/,/g, '')).toFixed(2);
};

export const sanitizeIfFilled = (value: string | number): string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return value !== '' ? sanitizeNumber(value) : '';
  }

  return '';
};
