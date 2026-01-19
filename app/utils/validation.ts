import { Company, InvoiceData, IssuerInfo } from '../types/types';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateCompany = (company: Omit<Company, 'id'>): ValidationResult => {
  if (!company.name?.trim()) {
    return { isValid: false, error: 'Company name is required' };
  }
  if (!company.address?.trim()) {
    return { isValid: false, error: 'Company address is required' };
  }
  return { isValid: true };
};

export const validateInvoiceData = (data: InvoiceData): ValidationResult => {
  if (!data.companyId) {
    return { isValid: false, error: 'Please select a company' };
  }
  if (!data.amount?.trim()) {
    return { isValid: false, error: 'Please enter an amount' };
  }
  if (!data.startDate) {
    return { isValid: false, error: 'Please select a start date' };
  }
  if (!data.endDate) {
    return { isValid: false, error: 'Please select an end date' };
  }
  return { isValid: true };
};

export const validateIssuerInfo = (info: IssuerInfo): ValidationResult => {
  if (!info.name?.trim()) {
    return { isValid: false, error: 'Please fill in your name in Settings first' };
  }
  if (!info.address?.trim()) {
    return { isValid: false, error: 'Please fill in your address in Settings first' };
  }
  return { isValid: true };
};

export const validateInvoiceGeneration = (
  data: InvoiceData,
  issuerInfo: IssuerInfo
): ValidationResult => {
  const invoiceValidation = validateInvoiceData(data);
  if (!invoiceValidation.isValid) {
    return invoiceValidation;
  }

  const issuerValidation = validateIssuerInfo(issuerInfo);
  if (!issuerValidation.isValid) {
    return issuerValidation;
  }

  return { isValid: true };
};
