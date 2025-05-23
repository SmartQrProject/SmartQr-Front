"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormInputs, AdminRegisterSchema } from "./authSchema";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import { useState } from "react";
import PasswordInput from "@/components/adminComponents/sessionInputs/PaswordInput";

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
      // Slug validation first
      const check = await fetch(
        `${APIURL}/restaurants/public?slug=${data.slug}`
      );
      if (check.status === 200) {
        toast.error("This slug is already taken. Please choose another.");
        return;
      } else if (check.status !== 404) {
        toast.error("Unable to validate slug. Please try again.");
        return;
      }

      // Save all required info for SuccessPage
      const restaurantData = {
        name: data.name,
        email: data.email,
        password: data.password,
        slug: data.slug,
      };
      localStorage.setItem("pendingRestaurant", JSON.stringify(restaurantData));
      console.log("✅ Saved to localStorage:", restaurantData);

      // Redirect to Stripe
      const res = await fetch(`${APIURL}/stripe/subscription-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: restaurantData.slug }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        toast.error(`Stripe error ${res.status}: ${errorText}`);
        return;
      }

      const { url } = await res.json();
      if (!url) throw new Error("No Stripe session returned");

      window.location.href = url;
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
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
          <input
            {...register("name")}
            className="w-full p-2 bg-white rounded-md"
            placeholder="John Smith"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label>Email</label>
          <input
            {...register("email")}
            className="w-full p-2 bg-white rounded-md"
            placeholder="johnSmith@mail.com"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label>Store Name</label>
          <input
            {...register("storeName")}
            className="w-full p-2 bg-white rounded-md"
            placeholder="My Store"
          />
          {errors.storeName && (
            <p className="text-red-500">{errors.storeName.message}</p>
          )}
        </div>

        <div>
          <label>Slug</label>
          <input
            {...register("slug")}
            className="w-full p-2 bg-white rounded-md"
            placeholder="default-store"
          />
          {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <PasswordInput
            register={register}
            name="password"
            error={errors.password?.message}
          />
        </div>

        <div>
          <label>Confirm Password</label>
          <PasswordInput
            register={register}
            name="confirmPassword"
            error={errors.confirmPassword?.message}
          />
        </div>

        <ButtonPrimary type="submit" loading={isSubmitting || isLoading}>
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
