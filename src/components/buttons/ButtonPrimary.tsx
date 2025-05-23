'use client';

import React from 'react';
import { ClipLoader } from 'react-spinners';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

const ButtonPrimary: React.FC<ButtonProps> = ({
  children,
  type = "button",
  disabled = false,
  loading = false,
  variant = 'primary',
  className = '',
  ...rest
}) => {
  const baseStyles = "w-full rounded-lg py-3 px-6 text-sm font-semibold transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm";
  
  const variantStyles = {
    primary: "bg-[#4f89f5] text-white hover:bg-[#5C77EF] active:bg-[#1437D1] disabled:bg-[#4f89f5]/50 disabled:cursor-not-allowed",
    secondary: "bg-white text-[#4f89f5] border-2 border-[#4f89f5] hover:bg-[#4f89f5]/10 active:bg-[#4f89f5]/20 disabled:border-[#4f89f5]/50 disabled:text-[#4f89f5]/50 disabled:cursor-not-allowed",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-red-500/50 disabled:cursor-not-allowed"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && <ClipLoader color={variant === 'secondary' ? '#4f89f5' : '#fff'} loading={true} size={20} />}
        {children}
      </div>
    </button>
  );
};

export default ButtonPrimary;
