import React, { useState } from 'react';
import { Download, Loader2, Trash2 } from 'lucide-react';
import { InvoiceHistoryItem } from '../../types/types';
import { Button, Card } from '../atoms';
import { formatUSD, formatShortDate, formatDateWithYear, formatFullDateTime } from '../../utils/formatting';

interface InvoiceHistoryCardProps {
  invoice: InvoiceHistoryItem;
  onDelete: () => void;
  onExport: () => Promise<void>;
}

export const InvoiceHistoryCard: React.FC<InvoiceHistoryCardProps> = ({
  invoice,
  onDelete,
  onExport,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await onExport();
    } finally {
      setIsExporting(false);
    }
  };

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
        <div className="flex flex-col md:items-end gap-3">
          <div className="text-2xl font-bold text-emerald-500 whitespace-nowrap">
            ${formatUSD(invoice.amount)}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="primary"
              onClick={handleExport}
              disabled={isExporting}
              title="Export PDF"
              aria-label="Export PDF"
              className="p-2 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            </Button>
            <Button
              variant="danger"
              onClick={onDelete}
              title="Delete"
              aria-label="Delete"
              className="p-2 px-3 text-sm"
            >
              <Trash2 size={16} />
            </Button>
          </div>
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
