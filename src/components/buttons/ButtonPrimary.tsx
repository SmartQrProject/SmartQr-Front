'use client';

import React from 'react';
import { ClipLoader } from 'react-spinners';  

export interface ButtonProps {
  onClick?: () => void;
  type?: "submit" | "button";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const ButtonPrimary: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = "button",
    disabled = false,
    loading = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full rounded bg-[#4f89f5] py-3 px-6 text-sm text-white font-bold hover:bg-[#5C77EF] active:bg-[#1437D1] flex items-center justify-center cursor-pointer"
    >
      <div className="flex items-center justify-center gap-2">
        {loading && <ClipLoader color="#fff" loading={true} size={20} />}
        {children}
      </div>
    </button>
  );
};

export default ButtonPrimary;
