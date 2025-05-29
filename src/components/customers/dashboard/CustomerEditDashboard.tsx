'use client';
import NavbarCustomer from '@/components/customers/navbarCustomer/NavbarCustomer';
import Footer from '@/components/subscribers/footer/Footer';
import PasswordInput from '@/components/adminComponents/sessionInputs/PaswordInput';
import Link from 'next/link';
import { FiArrowLeft, FiUser } from 'react-icons/fi';
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { UserProfileData, UserProfileSchema } from './customerSchema';
import { getCustomerById, modifyCustomersData } from '../fetch/customerUser';
import { zodResolver } from "@hookform/resolvers/zod";
import toast from 'react-hot-toast';

const CustomerEditDashboard = () => {
const [customer, setCustomer] = useState<any>(null);
const [token, setToken] = useState('');
const [slug, setSlug] = useState('');
const [id, setId] = useState('');

const {
  register,
  handleSubmit,
  reset,
  formState: { errors, isSubmitting },
} = useForm<UserProfileData>({
  resolver: zodResolver(UserProfileSchema),
});

useEffect(() => {
  const session = localStorage.getItem("customerSession");
  const storedSlug = localStorage.getItem("slug");

  if (!session || !storedSlug) return;

  const parsed = JSON.parse(session);
  const token = parsed.token;
  const id = parsed.payload.id;

  setToken(token);
  setSlug(storedSlug);
  setId(id);

  const fetchData = async () => {
    const response = await getCustomerById(token, storedSlug, id);
    if (response.success) {
      setCustomer(response.data);
      reset({
        phone: response.data.phone,
      });
    } else {
      console.error("❌ Failed to load customer data:", response.message);
    }
  };

  fetchData();
}, [reset]);


const onSubmit = async (data: UserProfileData) => {
  if (!slug || !token || !id) return;

  const { confirmPassword, phone, ...rest } = data;
  const sendData = {
    ...rest,
    phone: phone ? Number(phone) : undefined,
  };

  const result = await modifyCustomersData(slug, token, id, sendData);
  if (result.success) {
    toast.success("Data updated successfully");
  } else {

    toast.error("❌ Failed to update data");
  }
};

if (!customer ) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarCustomer />
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <div className="w-full mb-4 text-left">
          <Link
            href={`/customer/dashboard`}
            className="flex items-center gap-1 text-blue-500 text-md hover:underline"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Profile
          </Link>
        </div>

        <div className="max-w-md mx-auto m10 p-6 bg-default-50 rounded-xl w-full">
          <h1 className="text-center text-2xl font-bold mb-4 flex justify-center items-center gap-2">
            <FiUser className="w-6 h-6 text-gray-600" /> My Profile
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-center text-xl">Hello, {customer.name}</h2>
            <div className="relative w-20 h-20 mx-auto mt-4 mb-6">
              <img
                src={customer.picture ?? ""}
                alt="Foto"
                className="rounded-full w-20 h-20 object-cover"
              />
            </div>
            <span className="text-center block mb-2 text-sm font-medium text-gray-500">
              {customer.email}
            </span>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Phone</label>
              <input
                type="number"
                {...register('phone')}
                className="w-full p-2 bg-white rounded-md"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <PasswordInput
                register={register}
                name="password"
                error={errors.password?.message}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Confirm Password
              </label>
              <PasswordInput
                register={register}
                name="confirmPassword"
                error={errors.confirmPassword?.message}
              />
            </div>
            <span className='text-xs'>* You need to fill in all fields to update your information.</span>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-medium rounded-lg px-5 py-2.5 ${
                isSubmitting
                  ? 'bg-gray-400'
                  : 'bg-blue-700 hover:bg-blue-800 text-white'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerEditDashboard;
