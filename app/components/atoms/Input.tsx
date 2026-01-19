import React from 'react';

export const inputClasses = "w-full p-3 border-2 border-gray-200 rounded-lg text-base bg-white text-gray-900";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return <input className={`${inputClasses} ${className}`} {...props} />;
};
