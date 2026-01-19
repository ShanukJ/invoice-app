import { Company } from '../types/types';

/**
 * Generate a unique invoice number based on current date and company's invoice count
 * Format: YYMMDDXXXX where XXXX is the sequential invoice number
 */
export const generateInvoiceNumber = (company: Company): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const invoiceNum = String(company.invoiceCount + 1).padStart(4, '0');
  return `${year}${month}${date}${invoiceNum}`;
};
