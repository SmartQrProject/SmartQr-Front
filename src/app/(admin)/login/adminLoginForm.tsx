/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import { loginSchema } from "../signup/authSchema";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "./adminLoginContext";
import PasswordInput from "@/components/adminComponents/sessionInputs/PaswordInput";

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const { loginAdmin } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await loginAdmin(data);

            toast.success("Login successful! Redirecting...");
            reset();
            setTimeout(() => router.replace("/dashboard"), 2000);
        } catch (error: any) {
            const message = error?.message || "Login failed. Try again";
            toast.error(message);
            setError("password", { message });
        }
    };

    return (
        <div className=" max-w-md mx-auto mt-10 p-6 bg-neutral-100 rounded-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
                <div>
                    <label>Email</label>
                    <input {...register("email")} className="w-full p-2  bg-white rounded-md" placeholder="johnsmith@mail.com" />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
                <div>
                    <label>Password</label>
                    <PasswordInput register={register} name="password" error={errors.password?.message} />
                </div>
                <ButtonPrimary type="submit" disabled={isSubmitting} loading={isSubmitting}>
                    Login
                </ButtonPrimary>
                <p className="text-sm text-gray-700">
                    Do not have an account yet?{" "}
                    <Link href="/signup" className="text-[#4f89f5] hover:underline font-semibold">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}
