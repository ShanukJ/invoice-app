/**
 * Format a number or string amount to USD currency format
 */
export const formatUSD = (amount: string | number): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return numAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Format a date string to localized format
 */
export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Format date for invoice display (e.g., "January 15")
 */
export const formatInvoiceDate = (dateString: string): string => {
  return formatDate(dateString, { month: 'long', day: 'numeric' });
};

/**
 * Format date with full details (e.g., "Jan 15, 2026, 10:30 AM")
 */
export const formatFullDateTime = (dateString: string): string => {
  return formatDate(dateString, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date in short form (e.g., "Jan 15")
 */
export const formatShortDate = (dateString: string): string => {
  return formatDate(dateString, { month: 'short', day: 'numeric' });
};

/**
 * Format date with year (e.g., "Jan 15, 2026")
 */
export const formatDateWithYear = (dateString: string): string => {
  return formatDate(dateString, { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Get current month's start and end dates in YYYY-MM-DD format
 */
export const getCurrentMonthDates = (): { startDate: string; endDate: string } => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  const formatToISO = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return {
    startDate: formatToISO(startDate),
    endDate: formatToISO(endDate),
  };
};

/**
 * Get today's date formatted for invoices (e.g., "01/15/2026")
 */
export const getTodayFormatted = (): string => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
