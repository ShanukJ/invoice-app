import React from 'react';
import { inputClasses } from './Input';

const textareaClasses = `${inputClasses} font-[inherit]`;

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => {
  return <textarea className={`${textareaClasses} ${className}`} {...props} />;
};
