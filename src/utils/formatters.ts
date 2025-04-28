
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
