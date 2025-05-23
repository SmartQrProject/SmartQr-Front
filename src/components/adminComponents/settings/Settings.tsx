"use client"
import { useAuth } from '@/app/(admin)/login/adminLoginContext';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfileFormInputs, UserProfileSchema } from './SettingsSchema';
import { updateProfile, getProfile } from './fetchProfile';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ButtonPrimary from '@/components/buttons/ButtonPrimary';
import PasswordInput from '@/components/adminComponents/sessionInputs/PaswordInput';

const Settings = () => {
    const { user } = useAuth();
    const token = user?.token;
    const slug = user?.payload.slug;
    const userId = user?.payload.sub;
    
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

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
                setValue("name", userData.name || '');
                setValue("phone", userData.phone || '');
                setValue("address", userData.address || '');
                // Limpiar campos de contraseña
                setValue("password", '');
                setValue("confirmPassword", '');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error fetching profile');
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const onSubmit = async (data: UserProfileFormInputs) => {
        setIsLoading(true);
        try {
            const result = await updateProfile(token!, data, slug!, userId!);
            if (result.success) {
                toast.success('Profile updated successfully');
                reset({
                    name: '',
                    phone: '',
                    address: '',
                    password: '',
                    confirmPassword: '',
                });
                fetchProfileData();
            } else {
                toast.error(result.message || 'Failed to update profile');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error updating profile');
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
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-default-50 rounded-xl p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-center mb-6">Profile Settings</h1>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input 
                            type="email" 
                            value={user?.payload.email || ''} 
                            disabled 
                            className="w-full p-2 bg-gray-100 rounded-md text-gray-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">Email cannot be modified</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            {...register("name")}
                            className="w-full p-2 bg-white rounded-md border border-gray-300 focus:border-default-500 focus:ring-1 focus:ring-default-500"
                            placeholder="Enter your name"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input
                            {...register("phone")}
                            type="tel"
                            className="w-full p-2 bg-white rounded-md border border-gray-300 focus:border-default-500 focus:ring-1 focus:ring-default-500"
                            placeholder="+1234567890"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <textarea
                            {...register("address")}
                            className="w-full p-2 bg-white rounded-md border border-gray-300 focus:border-default-500 focus:ring-1 focus:ring-default-500 min-h-[100px]"
                            placeholder="Enter your address"
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                        )}
                    </div>

                    <div className="border-t pt-6 mt-6">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold">Password Settings <span className="text-gray-500 font-normal">(Optional)</span></h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">New Password</label>
                                <PasswordInput
                                    register={register}
                                    name="password"
                                    error={errors.password?.message}
                                    placeholder="Enter your new password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                                <PasswordInput
                                    register={register}
                                    name="confirmPassword"
                                    error={errors.confirmPassword?.message}
                                    placeholder="Enter your confirmed password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <ButtonPrimary
                            type="submit"
                            disabled={isLoading}
                            className="w-full max-w-md mx-auto"
                            variant="primary"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </div>
                            ) : (
                                'Save Changes'
                            )}
                        </ButtonPrimary>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Settings;