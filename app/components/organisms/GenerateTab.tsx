import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Company, InvoiceData } from '../../types/types';
import { Input, Select, Toggle } from '../atoms';
import { FormField } from '../molecules';
import { getCurrentMonthDates } from '../../utils/formatting';

interface GenerateTabProps {
  companies: Company[];
  invoiceData: InvoiceData;
  onInvoiceDataChange: (data: InvoiceData) => void;
  onGeneratePDF: () => void;
  generateInvoiceNumber: (company: Company) => string;
}

export const GenerateTab: React.FC<GenerateTabProps> = ({
  companies,
  invoiceData,
  onInvoiceDataChange,
  onGeneratePDF,
  generateInvoiceNumber,
}) => {
  const selectedCompany = companies.find(c => c.id === invoiceData.companyId);
  const [autoServicePeriod, setAutoServicePeriod] = useState(false);
  const [autoInvoiceNumber, setAutoInvoiceNumber] = useState(true);

  const generatedInvoiceNumber = selectedCompany ? generateInvoiceNumber(selectedCompany) : '';

  useEffect(() => {
    if (autoServicePeriod) {
      const { startDate, endDate } = getCurrentMonthDates();
      onInvoiceDataChange({ ...invoiceData, startDate, endDate });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoServicePeriod]);

  useEffect(() => {
    if (autoInvoiceNumber && selectedCompany) {
      onInvoiceDataChange({ ...invoiceData, invoiceNumber: generatedInvoiceNumber });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoInvoiceNumber, selectedCompany?.id, selectedCompany?.invoiceCount]);

  return (
    <div>
      <h2 className="mt-0 text-2xl md:text-3xl text-gray-900 mb-8">
        Generate New Invoice
      </h2>

      <div className="grid gap-5">
        <FormField label="Company">
          <Select
            value={invoiceData.companyId}
            onChange={(e) => onInvoiceDataChange({ ...invoiceData, companyId: e.target.value, purpose: '' })}
          >
            <option value="">Select a company...</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} (Invoices issued: {c.invoiceCount})
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Purpose">
          {selectedCompany && (selectedCompany.purposes || []).length > 0 ? (
            <Select
              value={invoiceData.purpose}
              onChange={(e) => onInvoiceDataChange({ ...invoiceData, purpose: e.target.value })}
            >
              <option value="">Select a purpose...</option>
              {(selectedCompany.purposes || []).map((purpose, index) => (
                <option key={index} value={purpose}>
                  {purpose}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              type="text"
              value={invoiceData.purpose}
              onChange={(e) => onInvoiceDataChange({ ...invoiceData, purpose: e.target.value })}
              placeholder={selectedCompany ? "No purposes defined - enter manually" : "Select a company first"}
            />
          )}
        </FormField>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Service Period</span>
            <Toggle
              enabled={autoServicePeriod}
              onChange={setAutoServicePeriod}
              label="Auto (Current Month)"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Start Date">
              <Input
                type="date"
                value={invoiceData.startDate}
                onChange={(e) => onInvoiceDataChange({ ...invoiceData, startDate: e.target.value })}
                disabled={autoServicePeriod}
                className={autoServicePeriod ? 'opacity-60 cursor-not-allowed' : ''}
              />
            </FormField>
            <FormField label="End Date">
              <Input
                type="date"
                value={invoiceData.endDate}
                onChange={(e) => onInvoiceDataChange({ ...invoiceData, endDate: e.target.value })}
                disabled={autoServicePeriod}
                className={autoServicePeriod ? 'opacity-60 cursor-not-allowed' : ''}
              />
            </FormField>
          </div>
        </div>

        <FormField label="Amount (USD)">
          <Input
            type="number"
            step="0.01"
            value={invoiceData.amount}
            onChange={(e) => onInvoiceDataChange({ ...invoiceData, amount: e.target.value })}
            placeholder="0.00"
          />
        </FormField>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Invoice Number</span>
            <Toggle
              enabled={autoInvoiceNumber}
              onChange={setAutoInvoiceNumber}
              label="Auto Generate"
            />
          </div>
          {autoInvoiceNumber ? (
            <div className="bg-gray-100 p-5 rounded-lg">
              <div className="text-2xl font-bold text-indigo-500">
                {selectedCompany ? generatedInvoiceNumber : 'Select a company first'}
              </div>
            </div>
          ) : (
            <Input
              type="text"
              value={invoiceData.invoiceNumber}
              onChange={(e) => onInvoiceDataChange({ ...invoiceData, invoiceNumber: e.target.value })}
              placeholder="Enter invoice number"
            />
          )}
        </div>

        <button
          onClick={onGeneratePDF}
          className="mt-5 p-4 bg-linear-to-r from-indigo-500 to-purple-600 text-white border-none rounded-lg text-lg font-semibold cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Download size={20} />
          Generate Invoice
        </button>
      </div>
    </div>
  );
};
