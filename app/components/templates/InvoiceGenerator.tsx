'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Building2, DollarSign, History } from 'lucide-react';
import {
  Company,
  BankDetails,
  IssuerInfo,
  InvoiceData,
  InvoiceHistoryItem,
  TabType,
} from '../../types/types';
import { TabButton } from '../molecules';
import { GenerateTab, CompaniesTab, HistoryTab, SettingsTab } from '../organisms';
import { downloadInvoicePDF } from './invoiceTemplate';
import { generateInvoiceNumber } from '../../utils/invoiceNumber';
import { validateCompany, validateInvoiceGeneration } from '../../utils/validation';
import {
  serializeHistoryToCSV,
  serializeHistoryToJSON,
  parseHistoryFromCSV,
  parseHistoryFromJSON,
  detectFormat,
  mergeHistory,
  downloadBlob,
  historyExportFilename,
} from '../../utils/invoiceExport';
import type { ImportMode } from '../../utils/invoiceExport';
import { useToast } from '../../contexts/ToastContext';

const STORAGE_KEYS = {
  companies: 'invoiceCompanies',
  bankDetails: 'invoiceBankDetails',
  issuerInfo: 'invoiceIssuerInfo',
  history: 'invoiceHistory',
} as const;

const saveToStorage = (key: string, data: unknown) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const loadFromStorage = <T,>(key: string): T | null => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const tabs = [
  { id: 'generate' as TabType, label: 'Generate', icon: FileText },
  { id: 'companies' as TabType, label: 'Companies', icon: Building2 },
  { id: 'history' as TabType, label: 'History', icon: History },
  { id: 'settings' as TabType, label: 'Settings', icon: DollarSign },
];

export const InvoiceGenerator: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('generate');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountNumber: '',
    bankName: '',
    swiftCode: '',
    branch: '',
    accountName: '',
  });
  const [issuerInfo, setIssuerInfo] = useState<IssuerInfo>({
    name: '',
    address: '',
  });
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    companyId: '',
    purpose: '',
    amount: '',
    startDate: '',
    endDate: '',
    invoiceNumber: '',
  });
  const [invoiceHistory, setInvoiceHistory] = useState<InvoiceHistoryItem[]>([]);
  const [selectedHistoryCompany, setSelectedHistoryCompany] = useState<string>('');
  const [editingCompany, setEditingCompany] = useState<string | null>(null);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [newCompany, setNewCompany] = useState<Omit<Company, 'id'>>({
    name: '',
    address: '',
    invoiceCount: 0,
    purposes: [],
  });

  useEffect(() => {
    const savedCompanies = loadFromStorage<Company[]>(STORAGE_KEYS.companies);
    const savedBank = loadFromStorage<BankDetails>(STORAGE_KEYS.bankDetails);
    const savedIssuer = loadFromStorage<IssuerInfo>(STORAGE_KEYS.issuerInfo);
    const savedHistory = loadFromStorage<InvoiceHistoryItem[]>(STORAGE_KEYS.history);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedCompanies) setCompanies(savedCompanies);
    if (savedBank) setBankDetails(savedBank);
    if (savedIssuer) setIssuerInfo(savedIssuer);
    if (savedHistory) setInvoiceHistory(savedHistory);
  }, []);

  const addCompany = () => {
    const validation = validateCompany(newCompany);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid company data');
      return;
    }

    const company: Company = {
      ...newCompany,
      id: Date.now().toString(),
    };

    const updatedCompanies = [...companies, company];
    setCompanies(updatedCompanies);
    saveToStorage(STORAGE_KEYS.companies, updatedCompanies);
    setNewCompany({ name: '', address: '', invoiceCount: 0, purposes: [] });
    setShowCompanyForm(false);
    toast.success('Company added successfully!');
  };

  const updateCompanyInList = (id: string, updates: Partial<Company>) => {
    const updatedCompanies = companies.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    setCompanies(updatedCompanies);
  };

  const saveCompanies = () => {
    saveToStorage(STORAGE_KEYS.companies, companies);
  };

  const deleteCompany = (id: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      const updatedCompanies = companies.filter(c => c.id !== id);
      setCompanies(updatedCompanies);
      saveToStorage(STORAGE_KEYS.companies, updatedCompanies);
      toast.success('Company deleted successfully!');
    }
  };

  const saveBankDetailsHandler = () => {
    saveToStorage(STORAGE_KEYS.bankDetails, bankDetails);
    toast.success('Bank details saved successfully!');
  };

  const saveIssuerInfoHandler = () => {
    saveToStorage(STORAGE_KEYS.issuerInfo, issuerInfo);
    toast.success('Issuer information saved successfully!');
  };

  const exportHistoryCSV = () => {
    if (invoiceHistory.length === 0) {
      toast.error('No invoice history to export.');
      return;
    }
    const csv = serializeHistoryToCSV(invoiceHistory);
    downloadBlob(csv, historyExportFilename('csv'), 'text/csv');
    toast.success(`Exported ${invoiceHistory.length} invoice${invoiceHistory.length === 1 ? '' : 's'} as CSV.`);
  };

  const exportHistoryJSON = () => {
    if (invoiceHistory.length === 0) {
      toast.error('No invoice history to export.');
      return;
    }
    const json = serializeHistoryToJSON(invoiceHistory);
    downloadBlob(json, historyExportFilename('json'), 'application/json');
    toast.success(`Exported ${invoiceHistory.length} invoice${invoiceHistory.length === 1 ? '' : 's'} as JSON.`);
  };

  const importHistory = async (file: File) => {
    let text: string;
    try {
      text = await file.text();
    } catch {
      toast.error('Could not read the selected file.');
      return;
    }

    if (!text.trim()) {
      toast.error('Selected file is empty.');
      return;
    }

    const format = detectFormat(file.name, text);
    let items: InvoiceHistoryItem[] = [];
    let parseSkipped = 0;
    try {
      const result = format === 'json' ? parseHistoryFromJSON(text) : parseHistoryFromCSV(text);
      items = result.items;
      parseSkipped = result.skipped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not parse the selected file.';
      toast.error(`Import failed: ${message}`);
      return;
    }

    if (items.length === 0) {
      toast.error('No valid invoice history entries were found in the file.');
      return;
    }

    let mode: ImportMode = 'merge';
    if (invoiceHistory.length > 0) {
      const replace = window.confirm(
        `Import ${items.length} invoice${items.length === 1 ? '' : 's'}?\n\n` +
          `OK = Replace the existing ${invoiceHistory.length} invoice${invoiceHistory.length === 1 ? '' : 's'}.\n` +
          `Cancel = Keep the current list and merge new entries into it.`
      );
      mode = replace ? 'replace' : 'merge';
    }

    try {
      let nextHistory: InvoiceHistoryItem[];
      let added = items.length;
      if (mode === 'replace') {
        nextHistory = [...items];
      } else {
        const result = mergeHistory(invoiceHistory, items);
        nextHistory = result.merged;
        added = result.added;
      }

      setInvoiceHistory(nextHistory);
      saveToStorage(STORAGE_KEYS.history, nextHistory);
      const skippedDupes = mode === 'merge' ? items.length - added : 0;
      const totalSkipped = parseSkipped + skippedDupes;
      const detail = totalSkipped > 0 ? `, skipped ${totalSkipped}` : '';
      toast.success(
        mode === 'replace'
          ? `Imported ${items.length} invoice${items.length === 1 ? '' : 's'}, replacing existing history${detail}.`
          : `Imported ${added} new invoice${added === 1 ? '' : 's'}${detail}.`
      );
    } catch (err) {
      console.error('Error saving imported history:', err);
      toast.error('Could not save imported history (storage may be full).');
    }
  };

  const generatePDF = async () => {
    const selectedCompany = companies.find(c => c.id === invoiceData.companyId);
    if (!selectedCompany) {
      toast.error('Please select a company');
      return;
    }

    const validation = validateInvoiceGeneration(invoiceData, issuerInfo);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid invoice data');
      return;
    }

    if (!invoiceData.invoiceNumber) {
      toast.error('Please enter an invoice number');
      return;
    }

    try {
      await downloadInvoicePDF({
        invoiceNumber: invoiceData.invoiceNumber,
        company: selectedCompany,
        issuerInfo,
        bankDetails,
        invoiceData,
      });

      // Update company invoice count
      const updatedCompanies = companies.map(c =>
        c.id === selectedCompany.id
          ? { ...c, invoiceCount: c.invoiceCount + 1 }
          : c
      );
      setCompanies(updatedCompanies);
      saveToStorage(STORAGE_KEYS.companies, updatedCompanies);

      // Save to history
      const historyItem: InvoiceHistoryItem = {
        id: Date.now().toString(),
        companyId: selectedCompany.id,
        companyName: selectedCompany.name,
        invoiceNumber: invoiceData.invoiceNumber,
        purpose: invoiceData.purpose,
        amount: invoiceData.amount,
        startDate: invoiceData.startDate,
        endDate: invoiceData.endDate,
        generatedAt: new Date().toISOString(),
      };
      const updatedHistory = [historyItem, ...invoiceHistory];
      setInvoiceHistory(updatedHistory);
      saveToStorage(STORAGE_KEYS.history, updatedHistory);

      toast.success(`Invoice ${invoiceData.invoiceNumber} generated successfully!`);
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Error generating invoice. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 to-purple-600 p-4 md:p-5 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 text-white">
          <div className="text-3xl md:text-5xl font-bold mb-2 tracking-tight flex items-center justify-center gap-3">
            <FileText className="w-8 h-8 md:w-12 md:h-12 shrink-0" />
            <span>Invoice Generator</span>
          </div>
          <div className="text-base opacity-90">
            Create professional invoices in seconds
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white/10 p-2 rounded-xl">
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl p-5 md:p-10 shadow-2xl">
          {activeTab === 'generate' && (
            <GenerateTab
              companies={companies}
              invoiceData={invoiceData}
              onInvoiceDataChange={setInvoiceData}
              onGeneratePDF={generatePDF}
              generateInvoiceNumber={generateInvoiceNumber}
            />
          )}

          {activeTab === 'companies' && (
            <CompaniesTab
              companies={companies}
              editingCompany={editingCompany}
              showCompanyForm={showCompanyForm}
              newCompany={newCompany}
              onSetEditingCompany={setEditingCompany}
              onSetShowCompanyForm={setShowCompanyForm}
              onSetNewCompany={setNewCompany}
              onAddCompany={addCompany}
              onUpdateCompany={updateCompanyInList}
              onDeleteCompany={deleteCompany}
              onSaveCompanies={saveCompanies}
            />
          )}

          {activeTab === 'history' && (
            <HistoryTab
              companies={companies}
              invoiceHistory={invoiceHistory}
              selectedHistoryCompany={selectedHistoryCompany}
              onSelectedHistoryCompanyChange={setSelectedHistoryCompany}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              issuerInfo={issuerInfo}
              bankDetails={bankDetails}
              onIssuerInfoChange={setIssuerInfo}
              onBankDetailsChange={setBankDetails}
              onSaveIssuerInfo={saveIssuerInfoHandler}
              onSaveBankDetails={saveBankDetailsHandler}
              invoiceHistoryCount={invoiceHistory.length}
              onExportHistoryCSV={exportHistoryCSV}
              onExportHistoryJSON={exportHistoryJSON}
              onImportHistory={importHistory}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80 text-sm">
          All data is stored locally in your browser
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
