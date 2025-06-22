"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminRestaurantSchema, RegisterFormInputs, RestaurantFormInputs } from "./authSchema";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import Link from "next/link";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterNewRestaurant() {
  const [adminSession, setAdminSession] = useState<{
    email: string;
    roles: string;
    name: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RestaurantFormInputs>({
    resolver: zodResolver(AdminRestaurantSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const stored = localStorage.getItem("adminSession");
    if (stored) {
      const payload = JSON.parse(stored)?.payload;
      if (payload?.roles === "owner" && payload?.email) {
        setAdminSession(payload);
        setValue("email", payload.email);
        // setValue("name", payload.name || payload.owner_name || "");
      }
    }
  }, [setValue]);

  const onSubmit = async (data: RestaurantFormInputs) => {

    try {
      const res = await fetch(`${APIURL}/restaurants/create-existing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.storeName,
          slug: data.slug,
          owner_email: data.email,
          isTrial: data.isTrial,
        }),
      });
  
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to create restaurant");
      }

      const json = await res.json();
      window.location.href = json.url;

    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    Cookies.remove("adminSession");
    toast.success("Create new restaurant with another email");
    window.location.href = "/signup";
  };

  if (!adminSession) return null;

  return (
    <div className="max-w-md mx-auto mt-10 mb-10 p-6 bg-default-50 rounded-xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2 mb-4">
          <p className="text-base font-medium text-gray-700">
            Dear <span className="text-blue-800 font-semibold">{adminSession.name}</span>,
          </p>
          <div className="text-sm font-medium text-gray-700">
            You are about to create a restaurant with the email:{" "}
            <strong>{adminSession.email}</strong>.<br />
            If you want to register a restaurant with a different email, please{" "}
            <Link
              onClick={handleLogout}
              href="/signup"
              className="text-blue-600 underline font-medium"
            >
              click here to register
            </Link>.
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="storeName">Store Name</label>
          <input
            id="storeName"
            {...register("storeName")}
            className="w-full p-2 bg-white rounded-md"
            placeholder="My Store"
          />
          {errors.storeName && <p className="text-red-500">{errors.storeName.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            {...register("slug")}
            className="w-full p-2 bg-white rounded-md"
            placeholder="my-store"
          />
          {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
        </div>

        <div className="mb-4">
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

        <ButtonPrimary type="submit" loading={isSubmitting}>
          Continue to Checkout
        </ButtonPrimary>
      </form>
    </div>
  );
}
