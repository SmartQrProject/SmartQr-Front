"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import { loginSchema } from "../signup/authSchema";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import PasswordInput from "@/components/adminComponents/sessionInputs/PaswordInput";
import { useEffect, useState } from "react";
import RestaurantSelectModal from "@/components/adminComponents/modals/RestaurantSelectModal";
import { Restaurant } from "@/types";

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { loginAdmin, setUser } = useAuth();
  const router = useRouter();

  const [isRestaurantInactive, setIsRestaurantInactive] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await loginAdmin(data);

      const session = localStorage.getItem("adminSession");
      const parsed = session ? JSON.parse(session) : null;

      if (parsed?.payload && !parsed.payload.restaurant && Array.isArray(parsed.payload.restaurants)) {
        if (parsed.payload.restaurants.length === 1) {
          const restaurant = parsed.payload.restaurants[0];
          parsed.payload.restaurant = restaurant;
          parsed.payload.slug = restaurant.slug;
          localStorage.setItem("adminSession", JSON.stringify(parsed));
          setUser(parsed);
        } else {
          setRestaurants(parsed.payload.restaurants);
          setShowRestaurantModal(true);
          toast.success("Login successful! Select your restaurant");
          reset();
          return;
        }
      }

      const isActive = parsed?.payload?.restaurant?.is_active;

      if (isActive === false) {
        setIsRestaurantInactive(true);
        reset();

        toast.error(
          "Your restaurant has been deactivated. Please contact us at accounts@smartqr.tech",
          { duration: 10000 }
        );

        return; 
      }

      toast.success("Login successful! Redirecting...");
      reset();
      setTimeout(() => router.replace("/dashboard"), 2000);
    } catch (error: any) {
      const message = error?.message || "Login failed. Try again";
      toast.error(message);
      setError("password", { message });
    }
  };

const handleRestaurantSelect = (restaurant: Restaurant) => {
  const session = localStorage.getItem("adminSession");
  if (!session) {
    router.replace("/login");
    return;
  }
  try {
    const parsed = JSON.parse(session);
    parsed.payload.restaurant = restaurant;
    parsed.payload.slug = restaurant.slug;
    localStorage.setItem("adminSession", JSON.stringify(parsed));
    setUser(parsed);
    toast.success("Restaurant selected! Redirecting...");
    setShowRestaurantModal(false);

       const interval = setInterval(() => {
      const check = localStorage.getItem("adminSession");
      const checkParsed = check ? JSON.parse(check) : null;
      if (checkParsed?.payload?.restaurant) {
        clearInterval(interval);
        router.replace("/dashboard");
      }
    }, 500);
  } catch (err) {
    console.error(err);
    router.replace("/login");
  }
};  

  const closeRestaurantModal = () => setShowRestaurantModal(false);

  return (
    <div className="relative max-w-md mx-auto mt-10 p-6 bg-neutral-100 rounded-xl">
      {isRestaurantInactive && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
          <p className="font-semibold">
            Your restaurant has been deactivated. Please contact us at{" "}
            <a href="mailto:accounts@smartqr.tech" className="underline">
              accounts@smartqr.tech
            </a>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        <div>
          <label>Email</label>
          <input
            {...register("email")}
            className="w-full p-2 bg-white rounded-md"
            placeholder="johnsmith@mail.com"
          />
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
      <RestaurantSelectModal
        open={showRestaurantModal}
        restaurants={restaurants}
        onSelect={handleRestaurantSelect}
        onClose={closeRestaurantModal}
      />
    </div>
  );
}