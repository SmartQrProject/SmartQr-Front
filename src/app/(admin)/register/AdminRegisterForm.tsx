"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormInputs, AdminRegisterSchema } from "./authSchema";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import { useState } from "react";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(AdminRegisterSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${APIURL}/stripe/checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const { url } = await res.json();

      if (!url) {
        toast.error("Stripe Checkout URL not received.");
        return;
      }

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (stripe) {
        window.location.href = url; 
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 mb-10 p-6 bg-default-50 rounded-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        <div>
          <label>Name</label>
          <input {...register("name")} className="w-full p-2 bg-white rounded-md" placeholder="John Smith" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label>Email</label>
          <input {...register("email")} className="w-full p-2 bg-white rounded-md" placeholder="johnSmith@mail.com" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label>Store Name</label>
          <input {...register("storeName")} className="w-full p-2 bg-white rounded-md" placeholder="John's Store" />
          {errors.storeName && <p className="text-red-500">{errors.storeName.message}</p>}
        </div>

        <div>
          <label>Slug</label>
          <input {...register("slug")} className="w-full p-2 bg-white rounded-md" placeholder="default-store" />
          {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register("password")} className="w-full p-2 bg-white rounded-md" />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <label>Confirm Password</label>
          <input type="password" {...register("confirmPassword")} className="w-full p-2 bg-white rounded-md" />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <ButtonPrimary type="submit" disabled={isSubmitting || isLoading}>
          {isLoading ? "Redirecting..." : "Continue to Checkout"}
        </ButtonPrimary>

        <p className="text-sm text-gray-700">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
