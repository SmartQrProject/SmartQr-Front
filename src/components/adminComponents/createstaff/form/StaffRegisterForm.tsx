'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
 import ButtonPrimary from '@/components/buttons/ButtonPrimary';
import toast from "react-hot-toast";
import { StaffFormInputs, StaffRegisterSchema } from "./SchemaStaff";
import { getUsers, staffRegister } from "./fectchUsers";
import PasswordInput from "../../sessionInputs/PaswordInput";
import { useState } from "react";
import { IUserStaff } from "@/types";

const StaffRegisterForm = ({ setUsers }: { setUsers: (u: IUserStaff[]) => void }) => {
    const [isLoading, setIsLoading] = useState(false);
    
  const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  reset,
} = useForm<StaffFormInputs>({
  resolver: zodResolver(StaffRegisterSchema),
  defaultValues: {
    role: "staff", // valor por defecto
  },
});

  const onSubmit = async (data: StaffFormInputs) => {
    setIsLoading(true);
  try {
    const session = localStorage.getItem("adminSession");
    if (!session) throw new Error("No session found");

    const parsed = JSON.parse(session);
    const token = parsed.token;
    const slug = parsed.payload?.slug;

    const completeData = {
      ...data,
      slug,      
      role: "staff" 
    } as StaffFormInputs;

    const response = await staffRegister(token, completeData, slug);
    const updated = await getUsers(slug, token);
    setUsers(updated.usuarios || []);
    

    if (response.success) {
      toast.success("User created successfully");
      reset()
    } else {
      if (response.message?.includes("already exists")) {
        toast.error("This user already exists");
      } else {
        toast.error(response.message || "Something went wrong");
      }
    }
      } catch (error) {
        
        toast.error("Something went wrong");
      } finally {
            setIsLoading(false);
        }
    };

    

  return (
     <div className="max-w-md mx-auto mb-10 p-6 bg-default-50 rounded-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-[#4f89f5] ">Staff User Creation</h1>
                <div className="flex flex-col">
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
                    <label>Password</label>
                    <PasswordInput register={register} name="password" error={errors.password?.message} />
                </div>

                <div>
                    <label>Confirm Password</label>
                    <PasswordInput register={register} name="confirmPassword" error={errors.confirmPassword?.message} />
                </div>

                <ButtonPrimary type="submit" loading={isSubmitting || isLoading}>
                    Register User
                </ButtonPrimary>

                
            </form>
        </div>
  );
};

export default StaffRegisterForm;
