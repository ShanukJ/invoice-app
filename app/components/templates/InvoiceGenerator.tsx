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

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M12 .296c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.387.6.111.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.333-5.467-5.93 0-1.311.469-2.381 1.236-3.221-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.241 2.873.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.103.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .321.218.694.825.576C20.565 22.092 24 17.592 24 12.296c0-6.627-5.373-12-12-12" />
  </svg>
);

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
          <div className="text-sm pt-2 opacity-90">
            All data is stored locally in your browser
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
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80 text-sm">
          <div className="mt-1">
            Developed by{' '}
            <a
              href="https://shanukj.me"
              target="_blank"
              rel="noreferrer"
              className="text-white/90 hover:text-white"
            >
              ShanukJ
            </a>{' '}
            with care
          </div>
          <a
            href="https://github.com/ShanukJ/invoice-app"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 mt-2 text-white/90 hover:text-white"
          >
            <GitHubIcon className="h-4 w-4" />
            View the source on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
