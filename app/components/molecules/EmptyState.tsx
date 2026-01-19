import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="text-center py-16 px-5 text-gray-400">
      <Icon size={48} className="mx-auto mb-4 opacity-50" />
      <div className="text-lg">{title}</div>
      {description && <div className="text-sm mt-2">{description}</div>}
    </div>
  );
};
