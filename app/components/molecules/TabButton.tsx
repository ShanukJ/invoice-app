import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TabButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 min-w-[45%] md:min-w-0 p-3 md:p-4 rounded-lg font-semibold cursor-pointer
        transition-all flex items-center justify-center gap-2
        ${isActive
          ? 'bg-white text-indigo-500'
          : 'bg-transparent text-white hover:bg-white/10'
        }
      `}
    >
      <Icon size={20} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
};
