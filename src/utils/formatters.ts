
/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date string to local date format
 */
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

/**
 * Format a large number with abbreviations (K, M, B)
 */
export const formatLargeNumber = (num: number) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Format a percentage value
 */
export const formatPercent = (value: number) => {
  return `${value.toFixed(1)}%`;
};
