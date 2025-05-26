'use client';

import { useEffect, useState } from 'react';
import NavbarCustomer from '@/components/customers/navbarCustomer/NavbarCustomer';
import Footer from '@/components/subscribers/footer/Footer';
import { getRestaurantWithMenu } from '@/helper/restaurantsSlugFetch';
import { getCustomerById, modifyCustomersData } from '../fetch/customerUser';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserProfileData, UserProfileSchema } from '../dashboard/customerSchema';
import PasswordInput from '@/components/adminComponents/sessionInputs/PaswordInput';
import Link from 'next/link';
import { FiArrowLeft, FiUser  } from 'react-icons/fi';

const CustomerEditDashboard = () => {
  const [slug, setSlug] = useState('');
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [customer, setCustomer] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserProfileData>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

 useEffect(() => {
  const storedSlug = localStorage.getItem('slug');
  const session = localStorage.getItem('customerSession');

  if (!storedSlug || !session) {
    setIsLoading(false);
    return;
  }

  const parsed = JSON.parse(session);
  const id = parsed?.payload?.id;
  const token = parsed?.token;
  const slugFromSession = slug || storedSlug;

  console.log("Eliana", parsed)
  setSlug(slugFromSession);

  const fetchData = async () => {
    try {
      const [restaurant, customerRes] = await Promise.all([
        getRestaurantWithMenu(slugFromSession),
        getCustomerById(token, slugFromSession, id),
      ]);

      if (!customerRes.success) {
        throw new Error(customerRes.message || "Failed to get customer");
      }

      setRestaurantData(restaurant);
      setCustomer(customerRes.data);

      reset({
        name: customerRes.data.name || '',
        phone: customerRes.data.phone || '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('❌ Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("✅ Slug usado:", slugFromSession);
  console.log("✅ ID usado:", id);
  console.log("✅ Token usado:", token.slice(0, 20) + "...")
  fetchData();
}, [reset]);
const onSubmit = async (data: UserProfileData) => {
  setIsSubmitting(true);
  try {
    const storedSession = localStorage.getItem('customerSession');
    const sessionData = storedSession ? JSON.parse(storedSession) : null;
    const id = sessionData?.payload?.id;
    const token = sessionData?.token;

    if (!slug || !id || !token || !customer)
      throw new Error('Missing session or customer data');
    
  const phoneNumber = Number(data.phone);
console.log("ELI", storedSession, slug, id, token, customer);
    if (isNaN(phoneNumber)) {
      throw new Error('The phone number must be a valid number');
    }

      const payload = {
      email: customer.email,
      phone: phoneNumber || customer.phone || data.phone,
      exist: true,
      name: data.name || customer.name,
      picture: customer.picture || '',
      ...(data.password
        ? { password: data.password, confirmPassword: data.confirmPassword }
        : {}),
      reward: customer.reward || 0,
    };

    const result = await modifyCustomersData(slug, token, id, payload);
    if (!result.success) throw new Error(result.message);
    alert('Profile updated successfully');

  } catch (error: any) {
    alert(error.message || 'Error updating profile');
  } finally {
    setIsSubmitting(false);
      }

      
};


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

      {isLoading ? (
        <p className="text-center">Loading customer data...</p>
      ) : !restaurantData ? (
        <p className="text-center text-red-500">Error: restaurant not found.</p>
      ) : !customer ? (
        <p className="text-center text-red-500">Error: customer not found.</p>
      ) : (
        <div className="max-w-md mx-auto m10 p-6 bg-default-50 rounded-xl w-full">
          <h1 className="text-center text-2xl font-bold mb-4 flex justify-center items-center gap-2"><FiUser className="w-6 h-6 text-gray-600" /> My Profile</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-center text-xl ">Hello, {customer.name}</h2>
            <div className="relative w-20 h-20 mx-auto mt-4 mb-6">
            <img src={customer.picture ?? ""} alt="Foto" className="rounded-full w-20 h-20 object-cover"/>
        </div>


          <span className="text-center block mb-2 text-sm font-medium text-gray-500"> {customer.email}</span>

            {/* <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-gray-700"> Points / Reward</label>

              <div className="flex items-center gap-3 bg-yellow-100 border border-yellow-300 rounded-xl px-4 py-3 shadow-sm"><FaStar className="text-yellow-500 w-5 h-5" /><input type="number" value={customer.reward || 0} disabled  className="bg-transparent text-lg font-medium text-yellow-800 w-full outline-none cursor-not-allowed"/>
              </div>
            </div> */}

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Phone</label>
              <input type="number" {...register('phone')} className="w-full p-2 bg-white rounded-md"/>{errors.phone && ( <p className="text-red-500 text-sm">{errors.phone.message}</p> )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <PasswordInput register={register} name="password" error={errors.password?.message}/>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900"> Confirm Password</label>
              <PasswordInput register={register} name="confirmPassword" error={errors.confirmPassword?.message}/>
            </div>

            <button type="submit" disabled={isSubmitting} className={`w-full font-medium rounded-lg px-5 py-2.5 ${isSubmitting ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800 text-white'}`}>{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
            
          </form>
        </div>
      )}
    </div>
    <Footer />
  </div>
);

}

export default CustomerEditDashboard;
