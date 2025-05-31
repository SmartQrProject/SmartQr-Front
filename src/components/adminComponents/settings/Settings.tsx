"use client";

import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfileFormInputs, UserProfileSchema } from "./SettingsSchema";
import { updateProfile, getProfile } from "./fetchProfile";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import PasswordInput from "@/components/adminComponents/sessionInputs/PaswordInput";

const Settings = () => {
    const { user } = useAuth();
    const router = useRouter();

    const token = user?.token;
    const slug = user?.payload.slug;
    const userId = user?.payload.sub;
    const role = user?.payload.roles;

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        if (!role || (role !== "owner" && role !== "staff")) {
            router.push("/404");
        }
    }, [role, router]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
    } = useForm<UserProfileFormInputs>({
        resolver: zodResolver(UserProfileSchema),
    });

    useEffect(() => {
        if (token && slug && userId) {
            fetchProfileData();
        }
    }, [token, slug, userId]);

    const fetchProfileData = async () => {
        try {
            setIsLoadingProfile(true);
            const userData = user?.payload;
            if (userData) {
                setValue("name", userData.name || "");
                setValue("phone", userData.phone || "");
                setValue("password", "");
                setValue("confirmPassword", "");
            }
        } catch (error: any) {
            toast.error(error.message || "Error fetching profile");
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const onSubmit = async (data: UserProfileFormInputs) => {
        setIsLoading(true);
        try {
            const result = await updateProfile(token!, data, slug!, userId!);
            if (result.success) {
                toast.success("Profile updated successfully");
                reset({
                    name: "",
                    phone: "",
                    password: "",
                    confirmPassword: "",
                });
                fetchProfileData();
            } else {
                toast.error(result.message || "Failed to update profile");
            }
        } catch (error: any) {
            toast.error(error.message || "Error updating profile");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingProfile) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-default-800"></div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mb-10 p-6 bg-default-50 rounded-xl shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-[#4f89f5]">Profile Settings</h1>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Email</label>
                    <input type="email" value={user?.payload.email || ""} disabled className="w-full p-2 bg-gray-100 rounded-md text-gray-500" />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be modified</p>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Name</label>
                    <input {...register("name")} className="w-full p-2 bg-white rounded-md" placeholder="Enter your name" />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Phone Number</label>
                    <input type="tel" {...register("phone")} className="w-full p-2 bg-white rounded-md" placeholder="+1234567890" />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>

                {/* Password Settings (optional) */}
                <div className="pt-4 border-t mt-4">
                    <h2 className="text-lg font-semibold mb-2">
                        Password Settings <span className="text-gray-500 font-normal">(Optional)</span>
                    </h2>

                    <div className="flex flex-col space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1">New Password</label>
                            <PasswordInput register={register} name="password" error={errors.password?.message} placeholder="Enter your new password" />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1">Confirm Password</label>
                            <PasswordInput register={register} name="confirmPassword" error={errors.confirmPassword?.message} placeholder="Enter your confirmed password" />
                        </div>
                    </div>
                </div>

                <ButtonPrimary type="submit" disabled={isLoading} className="w-full" variant="primary">
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Saving...
                        </div>
                    ) : (
                        "Save Changes"
                    )}
                </ButtonPrimary>
            </form>
        </div>
    );
};

export default Settings;
