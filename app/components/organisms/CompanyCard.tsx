import React, { useState } from 'react';
import { Edit2, Trash2, Save, Plus, X } from 'lucide-react';
import { Company } from '../../types/types';
import { Card, Button, Input, Textarea } from '../atoms';

interface CompanyCardProps {
  company: Company;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<Company>) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  isEditing,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onUpdate,
}) => {
  const [newPurpose, setNewPurpose] = useState('');

  const handleAddPurpose = () => {
    if (newPurpose.trim()) {
      onUpdate({ purposes: [...(company.purposes || []), newPurpose.trim()] });
      setNewPurpose('');
    }
  };

  const handleRemovePurpose = (index: number) => {
    const updatedPurposes = (company.purposes || []).filter((_, i) => i !== index);
    onUpdate({ purposes: updatedPurposes });
  };

  if (isEditing) {
    return (
      <Card>
        <div className="grid gap-4">
          <Input
            type="text"
            value={company.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Company Name"
          />
          <Textarea
            value={company.address}
            onChange={(e) => onUpdate({ address: e.target.value })}
            rows={3}
            placeholder="Company Address"
          />
          <Input
            type="number"
            value={company.invoiceCount}
            onChange={(e) => onUpdate({ invoiceCount: parseInt(e.target.value) || 0 })}
            placeholder="Invoice Count"
          />

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
            {(company.purposes || []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(company.purposes || []).map((purpose, index) => (
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
            <Button variant="success" onClick={onSave} fullWidth className="text-sm">
              <Save size={16} />
              Save
            </Button>
            <Button variant="gray" onClick={onCancelEdit} fullWidth className="text-sm">
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
        <div className="flex-1">
          <h3 className="m-0 mb-2 text-xl text-gray-900">{company.name}</h3>
          <div className="text-gray-500 text-sm whitespace-pre-line">{company.address}</div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="primary" onClick={onEdit} className="p-2 px-3 text-sm">
            <Edit2 size={16} />
          </Button>
          <Button variant="danger" onClick={onDelete} className="p-2 px-3 text-sm">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Display Purposes */}
      {(company.purposes || []).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-500 block mb-2">Purposes:</span>
          <div className="flex flex-wrap gap-2">
            {(company.purposes || []).map((purpose, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {purpose}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200">
        <span className="text-sm text-gray-500">
          Invoices Issued: <strong className="text-indigo-500">{company.invoiceCount}</strong>
        </span>
      </div>
    </Card>
  );
};
