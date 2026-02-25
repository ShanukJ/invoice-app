import React, { useState } from 'react';
import { Plus, Building2, Save, X } from 'lucide-react';
import { Company } from '../../types/types';
import { Button, Input, Textarea, Card } from '../atoms';
import { EmptyState } from '../molecules';
import { CompanyCard } from './CompanyCard';

interface CompaniesTabProps {
  companies: Company[];
  editingCompany: string | null;
  showCompanyForm: boolean;
  newCompany: Omit<Company, 'id'>;
  onSetEditingCompany: (id: string | null) => void;
  onSetShowCompanyForm: (show: boolean) => void;
  onSetNewCompany: (company: Omit<Company, 'id'>) => void;
  onAddCompany: () => void;
  onUpdateCompany: (id: string, updates: Partial<Company>) => void;
  onDeleteCompany: (id: string) => void;
  onSaveCompanies: () => void;
}

export const CompaniesTab: React.FC<CompaniesTabProps> = ({
  companies,
  editingCompany,
  showCompanyForm,
  newCompany,
  onSetEditingCompany,
  onSetShowCompanyForm,
  onSetNewCompany,
  onAddCompany,
  onUpdateCompany,
  onDeleteCompany,
  onSaveCompanies,
}) => {
  const [newPurpose, setNewPurpose] = useState('');

  const handleAddPurpose = () => {
    if (newPurpose.trim()) {
      onSetNewCompany({ ...newCompany, purposes: [...(newCompany.purposes || []), newPurpose.trim()] });
      setNewPurpose('');
    }
  };

  const handleRemovePurpose = (index: number) => {
    const updatedPurposes = (newCompany.purposes || []).filter((_, i) => i !== index);
    onSetNewCompany({ ...newCompany, purposes: updatedPurposes });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h2 className="m-0 text-2xl md:text-3xl text-gray-900">
          Manage Companies
        </h2>
        <Button variant="primary" onClick={() => onSetShowCompanyForm(true)} className="px-6">
          <Plus size={20} />
          Add Company
        </Button>
      </div>

      {showCompanyForm && (
        <Card className="mb-8">
          <h3 className="mt-0 mb-5 text-lg text-black">New Company</h3>
          <div className="grid gap-4">
            <Input
              type="text"
              placeholder="Company Name"
              value={newCompany.name}
              onChange={(e) => onSetNewCompany({ ...newCompany, name: e.target.value })}
            />
            <Textarea
              placeholder="Company Address"
              value={newCompany.address}
              onChange={(e) => onSetNewCompany({ ...newCompany, address: e.target.value })}
              rows={3}
            />
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Starting Invoice Count (default: 0)</label>
              <Input
              type="number"
              placeholder="Starting Invoice Count (default: 0)"
              value={newCompany.invoiceCount}
              onChange={(e) => onSetNewCompany({ ...newCompany, invoiceCount: parseInt(e.target.value) || 0 })}
            />
            </div>
            

            {/* Purposes Management */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purposes</label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  placeholder="Add a purpose..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPurpose())}
                />
                <Button variant="primary" onClick={handleAddPurpose} className="px-3 shrink-0">
                  <Plus size={16} />
                </Button>
              </div>
              {(newCompany.purposes || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(newCompany.purposes || []).map((purpose, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {purpose}
                      <button
                        onClick={() => handleRemovePurpose(index)}
                        className="hover:text-indigo-900 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="success" onClick={onAddCompany} fullWidth>
                <Save size={18} />
                Save
              </Button>
              <Button
                variant="gray"
                onClick={() => {
                  onSetShowCompanyForm(false);
                  onSetNewCompany({ name: '', address: '', invoiceCount: 0, purposes: [] });
                }}
                fullWidth
              >
                <X size={18} />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {companies.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No companies added yet"
            description='Click "Add Company" to get started'
          />
        ) : (
          companies.map(company => (
            <CompanyCard
              key={company.id}
              company={company}
              isEditing={editingCompany === company.id}
              onEdit={() => onSetEditingCompany(company.id)}
              onCancelEdit={() => onSetEditingCompany(null)}
              onSave={() => {
                onSaveCompanies();
                onSetEditingCompany(null);
              }}
              onDelete={() => onDeleteCompany(company.id)}
              onUpdate={(updates) => onUpdateCompany(company.id, updates)}
            />
          ))
        )}
      </div>
    </div>
  );
};
