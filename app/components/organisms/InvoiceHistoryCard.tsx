import React from 'react';
import { InvoiceHistoryItem } from '../../types/types';
import { Card } from '../atoms';
import { formatUSD, formatShortDate, formatDateWithYear, formatFullDateTime } from '../../utils/formatting';

interface InvoiceHistoryCardProps {
  invoice: InvoiceHistoryItem;
}

export const InvoiceHistoryCard: React.FC<InvoiceHistoryCardProps> = ({ invoice }) => {
  return (
    <Card>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-3">
        <div className="flex-1">
          <h3 className="m-0 mb-2 text-xl text-gray-900">
            Invoice #{invoice.invoiceNumber}
          </h3>
          <div className="text-indigo-500 font-semibold text-sm">
            {invoice.companyName}
          </div>
        </div>
        <div className="text-2xl font-bold text-emerald-500 whitespace-nowrap">
          ${formatUSD(invoice.amount)}
        </div>
      </div>
      <div className="text-gray-500 text-sm mb-2">{invoice.purpose}</div>
      <div className="flex flex-col md:flex-row md:justify-between gap-2 mt-3 pt-3 border-t border-gray-200 text-xs text-gray-400">
        <span>
          Period: {formatShortDate(invoice.startDate)} - {formatDateWithYear(invoice.endDate)}
        </span>
        <span>
          Generated: {formatFullDateTime(invoice.generatedAt)}
        </span>
      </div>
    </Card>
  );
};
