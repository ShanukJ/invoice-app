import type { InputHTMLAttributes } from 'react';

export const inputClasses = "w-full p-3 border-2 border-gray-200 rounded-lg text-base bg-white text-gray-900";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
  return <input className={`${inputClasses} ${className}`} {...props} />;
}
