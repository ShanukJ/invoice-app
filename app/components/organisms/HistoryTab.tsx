import React from 'react';
import { Clock } from 'lucide-react';
import { Company, InvoiceHistoryItem } from '../../types/types';
import { Select } from '../atoms';
import { EmptyState } from '../molecules';
import { InvoiceHistoryCard } from './InvoiceHistoryCard';

interface HistoryTabProps {
  companies: Company[];
  invoiceHistory: InvoiceHistoryItem[];
  selectedHistoryCompany: string;
  onSelectedHistoryCompanyChange: (companyId: string) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  companies,
  invoiceHistory,
  selectedHistoryCompany,
  onSelectedHistoryCompanyChange,
}) => {
  const filteredHistory = invoiceHistory.filter(
    invoice => !selectedHistoryCompany || invoice.companyId === selectedHistoryCompany
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h2 className="m-0 text-2xl md:text-3xl text-gray-900">
          Invoice History
        </h2>
        <Select
          value={selectedHistoryCompany}
          onChange={(e) => onSelectedHistoryCompanyChange(e.target.value)}
          className="md:w-auto md:min-w-[250px]"
        >
          <option value="">All Companies</option>
          {companies.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
      </div>

      <div className="grid gap-4">
        {invoiceHistory.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No invoices generated yet"
            description="Generated invoices will appear here"
          />
        ) : filteredHistory.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No invoices for this company"
          />
        ) : (
          filteredHistory.map(invoice => (
            <InvoiceHistoryCard key={invoice.id} invoice={invoice} />
          ))
        )}
      </div>
    </div>
  );
};
