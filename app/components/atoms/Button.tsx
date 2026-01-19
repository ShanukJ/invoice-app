import React from 'react';

type ButtonVariant = 'primary' | 'success' | 'gray' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-500 hover:bg-indigo-600',
  success: 'bg-emerald-500 hover:bg-emerald-600',
  gray: 'bg-gray-500 hover:bg-gray-600',
  danger: 'bg-red-500 hover:bg-red-600',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`
        p-3 text-white border-none rounded-lg text-base font-semibold cursor-pointer
        flex items-center justify-center gap-2 transition-colors
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
