import React from 'react';

interface FormFieldProps {
  label?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, children }) => {
  return (
    <div>
      {label && (
        <label className="block mb-2 font-semibold text-gray-700">
          {label}
        </label>
      )}
      {children}
    </div>
  );
};
