export interface Company {
  id: string;
  name: string;
  address: string;
  invoiceCount: number;
  purposes: string[];
}

export interface BankDetails {
  accountNumber: string;
  bankName: string;
  swiftCode: string;
  branch: string;
  accountName: string;
}

export interface IssuerInfo {
  name: string;
  address: string;
}

export interface InvoiceData {
  companyId: string;
  purpose: string;
  amount: string;
  startDate: string;
  endDate: string;
  invoiceNumber: string;
}

export interface InvoiceHistoryItem {
  id: string;
  companyId: string;
  companyName: string;
  invoiceNumber: string;
  purpose: string;
  amount: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
}

export type TabType = 'generate' | 'companies' | 'history' | 'settings';
