"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminRegisterSchema, RegisterFormInputs } from "./authSchema";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import PasswordInput from "@/components/adminComponents/sessionInputs/PaswordInput";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminRegisterForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(AdminRegisterSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${APIURL}/restaurants/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_name: data.ownerName,
          name: data.storeName,
          slug: data.slug,
          owner_email: data.email,
          owner_pass: data.password,
          isTrial: data.isTrial,
        }),
      });

      if (!res.ok) throw new Error("Registration failed");

      const json = await res.json();
      window.location.href = json.url;
    } catch (error: any) {
      toast.error(error.message || "Error creating restaurant");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 mb-10 p-6 bg-default-50 rounded-xl">
      <form className="space-y-4 max-w-sm"
        onSubmit={handleSubmit(onSubmit, (errors) => {
        })}
      >
        

          <>            
            <div>
              <label htmlFor="ownerName">Name and Last Name</label>
              <input
                id="ownerName"
                {...register("ownerName")}
                className="w-full p-2 bg-white rounded-md"
                placeholder="John Smith"
              />
              {errors.ownerName && <p className="text-red-500">{errors.ownerName.message}</p>}
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                {...register("email")}
                className="w-full p-2 bg-gray-100 rounded-md"
                placeholder="johnSmith@mail.com"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="storeName">Store Name</label>
              <input
                id="storeName"
                {...register("storeName")}
                className="w-full p-2 bg-white rounded-md"
                placeholder="My Store"
              />
              {errors.storeName && <p className="text-red-500">{errors.storeName.message}</p>}
            </div>

            <div>
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                {...register("slug")}
                className="w-full p-2 bg-white rounded-md"
                placeholder="my-store"
              />
              {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <PasswordInput register={register} name="password" error={errors.password?.message} />
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <PasswordInput
                register={register}
                name="confirmPassword"
                error={errors.confirmPassword?.message}
              />
            </div>
          </>
        

        <div>
          <label className="block font-medium mb-2">Start with:</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="false"
                {...register("isTrial", {
                  setValueAs: (v) => v === "true",
                })}
                defaultChecked
              />
              <span>Pay Now</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="true"
                {...register("isTrial", {
                  setValueAs: (v) => v === "true",
                })}
              />
              <span>Free Trial (14 days)</span>
            </label>
          </div>
          {errors.isTrial && <p className="text-red-500 text-sm">{errors.isTrial.message}</p>}
        </div>

        <ButtonPrimary className="my-3" type="submit" loading={isSubmitting || isLoading}>
          Continue to Checkout
        </ButtonPrimary>

       
          <p className="text-sm text-gray-700">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline font-semibold">
              Login
            </Link>
          </p>
        
      </form>
    </div>
  );
}
