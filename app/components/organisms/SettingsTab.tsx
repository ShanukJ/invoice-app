import React from 'react';
import { Save } from 'lucide-react';
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
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  issuerInfo,
  bankDetails,
  onIssuerInfoChange,
  onBankDetailsChange,
  onSaveIssuerInfo,
  onSaveBankDetails,
}) => {
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
      <div>
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
    </div>
  );
};
