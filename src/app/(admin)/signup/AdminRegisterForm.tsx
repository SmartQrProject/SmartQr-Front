"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    RegisterFormInputs,
    AdminRegisterSchema,
    AdminRestaurantSchema,
} from "./authSchema";
import { checkEmail } from "@/libs/checkEmail";
import { toast } from "react-hot-toast";
import Link from "next/link";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";

import { useState, useMemo } from "react";

import PasswordInput from "@/components/adminComponents/sessionInputs/PaswordInput";

export default function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [step, setStep] = useState<"email" | "details">("email");
    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    const formResolver = useMemo(
        () => zodResolver(emailExists ? AdminRestaurantSchema : AdminRegisterSchema),
        [emailExists]
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
        trigger,
    } = useForm<RegisterFormInputs>({
        resolver: formResolver,
        mode: "onChange",
    });

    const handleNext = async () => {
        const valid = await trigger("email");
        if (!valid) return;
        setIsLoading(true);
        try {
            const { exists } = await checkEmail(getValues("email"));
            setEmailExists(exists);
            if (exists) {
                toast.success("Existing account found. We'll link this restaurant to it.");
            }
            setStep("details");
        } catch (err) {
            console.error("Email check error", err);
            toast.error("Unable to verify email");
        } finally {
            setIsLoading(false);
        }
    };


    const onSubmit = async (data: RegisterFormInputs) => {
        setIsLoading(true);

        try {
            const restaurantData = emailExists
                ? {
                      name: data.storeName,
                      slug: data.slug,
                      owner_email: data.email,
                      isTrial: data.isTrial,
                  }
                : {
                      owner_name: data.ownerName,
                      name: data.storeName,
                      slug: data.slug,
                      owner_email: data.email,
                      owner_pass: data.password,
                      isTrial: data.isTrial,
                  };

            const endpoint = emailExists
                ? `${APIURL}/restaurants/create-existing`
                : `${APIURL}/restaurants/create`;

            const createRes = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(restaurantData),
            });

            if (!createRes.ok) {
                const errorData = await createRes.json();
                let message = errorData.message || "Error creating the restaurant";
                if (message.includes("registered")) {
                    message = "This restaurant name is already registered";
                }
                throw new Error(message);
            }

            const json = await createRes.json();
            window.location.href = json.url;
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong. Please try again.");
            console.error("Registration error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 mb-10 p-6 bg-default-50 rounded-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
                {step === "email" && (
                    <>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                {...register("email")}
                                className="w-full p-2 bg-white rounded-md"
                                placeholder="johnSmith@mail.com"
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>
                        <ButtonPrimary type="button" onClick={handleNext} loading={isSubmitting || isLoading}>
                            Next
                        </ButtonPrimary>
                    </>
                )}

                {step === "details" && (
                    <>
                        {!emailExists && (
                            <div>
                                <label htmlFor="ownerName">Name and Last Name</label>
                                <input id="ownerName" {...register("ownerName")} className="w-full p-2 bg-white rounded-md" placeholder="John Smith" />
                                {errors.ownerName && <p className="text-red-500">{errors.ownerName.message}</p>}
                            </div>
                        )}

                        {emailExists && (
                            <p className="text-green-600 text-sm">Existing account detected. We will assign this restaurant to it.</p>
                        )}

                        <div>
                            <label htmlFor="storeName">Store Name</label>
                            <input id="storeName" {...register("storeName")} className="w-full p-2 bg-white rounded-md" placeholder="My Store" />
                            {errors.storeName && <p className="text-red-500">{errors.storeName.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="slug">Slug</label>
                            <input id="slug" {...register("slug")} className="w-full p-2 bg-white rounded-md" placeholder="my-store" />
                            {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
                        </div>

                        {!emailExists && (
                            <>
                                <div>
                                    <label htmlFor="password">Password</label>
                                    <PasswordInput register={register} name="password" error={errors.password?.message} />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <PasswordInput register={register} name="confirmPassword" error={errors.confirmPassword?.message} />
                                </div>
                            </>
                        )}

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

                        <ButtonPrimary type="submit" loading={isSubmitting || isLoading}>
                            Continue to Checkout
                        </ButtonPrimary>
                    </>
                )}

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
