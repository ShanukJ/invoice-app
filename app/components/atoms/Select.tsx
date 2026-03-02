import type { ReactNode, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { inputClasses } from './Input';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
};

const selectClasses = [
  inputClasses,
  'pr-10',
  'appearance-none',
  'cursor-pointer',
].join(' ');

export function Select({ className = '', children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={`${selectClasses} ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
        aria-hidden="true"
      />
    </div>
  );
}
