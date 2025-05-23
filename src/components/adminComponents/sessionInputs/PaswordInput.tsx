"use client";

import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";

interface PasswordInputProps {
    register: UseFormRegister<any>;
    name: string;
    error?: string;
    placeholder?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ register, name, error, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <input type={showPassword ? "text" : "password"} {...register(name)} placeholder={placeholder || "Enter your password"} className="w-full p-2 bg-white rounded-md pr-10" />
            <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default PasswordInput;
