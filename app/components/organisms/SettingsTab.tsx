import React, { useRef } from 'react';
import { Save, Download, Upload, FileJson, FileSpreadsheet } from 'lucide-react';
import { BankDetails, IssuerInfo } from '../../types/types';
import { Input, Textarea, Button } from '../atoms';
import { FormField } from '../molecules';

interface SettingsTabProps {
  issuerInfo: IssuerInfo;
  bankDetails: BankDetails;
  onIssuerInfoChange: (info: IssuerInfo) => void;
  onBankDetailsChange: (details: BankDetails) => void;
  onSaveIssuerInfo: () => void;
  onSaveBankDetails: () => void;
  invoiceHistoryCount: number;
  onExportHistoryCSV: () => void;
  onExportHistoryJSON: () => void;
  onImportHistory: (file: File) => void | Promise<void>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  issuerInfo,
  bankDetails,
  onIssuerInfoChange,
  onBankDetailsChange,
  onSaveIssuerInfo,
  onSaveBankDetails,
  invoiceHistoryCount,
  onExportHistoryCSV,
  onExportHistoryJSON,
  onImportHistory,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onImportHistory(file);
    }
    // Reset so selecting the same file again still triggers onChange.
    e.target.value = '';
  };

  const hasHistory = invoiceHistoryCount > 0;

  return (
    <div>
      <h2 className="mt-0 text-2xl md:text-3xl text-gray-900 mb-8">
        Settings
      </h2>

      {/* Issuer Information */}
      <div className="mb-10">
        <h3 className="text-xl mb-5 text-gray-700">Your Information</h3>
        <div className="grid gap-4">
          <FormField label="Your Name">
            <Input
              type="text"
              value={issuerInfo.name}
              onChange={(e) => onIssuerInfoChange({ ...issuerInfo, name: e.target.value })}
              placeholder="e.g., John Doe"
            />
          </FormField>
          <FormField label="Your Address">
            <Textarea
              value={issuerInfo.address}
              onChange={(e) => onIssuerInfoChange({ ...issuerInfo, address: e.target.value })}
              placeholder=""
              rows={3}
            />
          </FormField>
          <Button variant="success" onClick={onSaveIssuerInfo}>
            <Save size={18} />
            Save Issuer Information
          </Button>
        </div>
      </div>

      {/* Bank Details */}
      <div className="mb-10">
        <h3 className="text-xl mb-5 text-gray-700">Bank Details</h3>
        <div className="grid gap-4">
          <FormField label="Account Number">
            <Input
              type="text"
              value={bankDetails.accountNumber}
              onChange={(e) => onBankDetailsChange({ ...bankDetails, accountNumber: e.target.value })}
            />
          </FormField>
          <FormField label="Bank Name">
            <Input
              type="text"
              value={bankDetails.bankName}
              onChange={(e) => onBankDetailsChange({ ...bankDetails, bankName: e.target.value })}
            />
          </FormField>
          <FormField label="SWIFT Code">
            <Input
              type="text"
              value={bankDetails.swiftCode}
              onChange={(e) => onBankDetailsChange({ ...bankDetails, swiftCode: e.target.value })}
            />
          </FormField>
          <FormField label="Branch">
            <Input
              type="text"
              value={bankDetails.branch}
              onChange={(e) => onBankDetailsChange({ ...bankDetails, branch: e.target.value })}
            />
          </FormField>
          <FormField label="Account Name">
            <Input
              type="text"
              value={bankDetails.accountName}
              onChange={(e) => onBankDetailsChange({ ...bankDetails, accountName: e.target.value })}
            />
          </FormField>
          <Button variant="success" onClick={onSaveBankDetails}>
            <Save size={18} />
            Save Bank Details
          </Button>
        </div>
      </div>

      {/* Data Management */}
      <div>
        <h3 className="text-xl mb-2 text-gray-700">Invoice History Data</h3>
        <p className="text-sm text-gray-500 mb-5">
          Export invoice history as CSV or JSON, or import a previously exported file.
          Companies and settings are not affected.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <Button
            variant="primary"
            onClick={onExportHistoryCSV}
            disabled={!hasHistory}
            className={!hasHistory ? 'opacity-60 cursor-not-allowed' : ''}
            aria-label="Export invoice history as CSV"
          >
            <FileSpreadsheet size={18} />
            Export CSV
          </Button>
          <Button
            variant="primary"
            onClick={onExportHistoryJSON}
            disabled={!hasHistory}
            className={!hasHistory ? 'opacity-60 cursor-not-allowed' : ''}
            aria-label="Export invoice history as JSON"
          >
            <FileJson size={18} />
            Export JSON
          </Button>
          <Button
            variant="gray"
            onClick={handleImportClick}
            aria-label="Import invoice history from CSV or JSON"
          >
            <Upload size={18} />
            Import File
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-3 flex items-center gap-2">
          <Download size={14} />
          <span>
            {hasHistory
              ? `${invoiceHistoryCount} invoice${invoiceHistoryCount === 1 ? '' : 's'} available to export.`
              : 'No invoices to export yet.'}
          </span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json,text/csv,application/json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
