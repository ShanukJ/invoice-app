import type { TextareaHTMLAttributes } from 'react';
import { inputClasses } from './Input';

const textareaClasses = `${inputClasses} font-[inherit]`;

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = '', ...props }: TextareaProps) {
  return <textarea className={`${textareaClasses} ${className}`} {...props} />;
}
