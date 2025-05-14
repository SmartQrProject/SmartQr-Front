'use client';

import React from 'react';
import { ClipLoader } from 'react-spinners';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const ButtonPrimary: React.FC<ButtonProps> = ({
  children,
  type = "button",
  disabled = false,
  loading = false,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className="w-full rounded bg-[#4f89f5] py-3 px-6 text-sm text-white font-bold hover:bg-[#5C77EF] active:bg-[#1437D1] flex items-center justify-center cursor-pointer"
      {...rest}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && <ClipLoader color="#fff" loading={true} size={20} />}
        {children}
      </div>
    </button>
  );
};

export default ButtonPrimary;
