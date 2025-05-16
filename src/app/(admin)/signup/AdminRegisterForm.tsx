"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormInputs, AdminRegisterSchema } from "./authSchema";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
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
  const { email, slug, ...rest } = data;
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedSlug = slug.trim().toLowerCase();

  try {
    
    const slugRes = await fetch(`${APIURL}/restaurants?slug=${trimmedSlug}`);
    
    if (slugRes.ok) {
      const restaurantData = await slugRes.json();
      
      if (restaurantData.exist) {
        if (restaurantData.owner_email === trimmedEmail) {
          toast.error("This email is already registered with this restaurant.");
        } else {
          toast.error("This store slug is already taken.");
        }

        setIsLoading(false);
        return;
      }
    }

    const cleanData = { email: trimmedEmail, slug: trimmedSlug, ...rest };
    localStorage.setItem("pendingRestaurant", JSON.stringify(cleanData));

    const res = await fetch(`${APIURL}/stripe/subscription-session`);
    const { url } = await res.json();

    if (!url) {
      throw new Error("No Stripe session found");
    }

    reset();
    toast.success("Redirecting to payment...");
    setTimeout(() => {
      window.location.href = url;
    }, 2000);
  } catch (error: any) {
    const message = error?.message || "Something went wrong. Please try again.";
    toast.error(message);
    console.error("Checkout error:", error);
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
          <label htmlFor="email">Email</label>
          <input {...register("email")} className="w-full p-2 bg-white rounded-md" placeholder="johnSmith@mail.com" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label>Store Name</label>
          <input {...register("storeName")} className="w-full p-2 bg-white rounded-md" placeholder="My Store" />
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

        <ButtonPrimary
          type="submit"
          loading={isSubmitting || isLoading}
        >
          Continue to Checkout
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
