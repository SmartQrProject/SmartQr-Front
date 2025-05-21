"use client"
import { useAuth } from '@/app/(admin)/login/adminLoginContext'
import { StoreIcon } from 'lucide-react';
import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const Home = () => {
  const { user } = useAuth();
  return (
    <div className='m-6'>
      <h1 className='text-3xl font-bold mb-2'>Hi, Owner!</h1>
      <h2 className='text-xl font-semibold text-gray-600'>Today's Summary</h2>

      <div className='grid grid-cols-2 gap-4 mt-6 h-40'>
        <div className='border border-gray-300 p-4 rounded-2xl shadow-sm bg-white'>
          <p className='text-lg font-semibold mb-2'>Your weekly sales target is:</p>
          <p className='text-2xl font-bold text-green-600 mt-16'>$1,000</p>
        </div>

        <div className='border border-gray-300 p-4 rounded-2xl shadow-sm bg-white flex flex-col justify-between'>
          <div className='flex items-center justify-between'>
            <p className='text-lg font-semibold'>Today's Orders</p>
            <FaShoppingCart className='text-2xl text-gray-700' />
          </div>
          <p className='text-3xl font-bold text-blue-500 mt-4'>600</p>
        </div>
      </div>

      <div className='border border-gray-300 p-6 rounded-2xl shadow-sm bg-white mt-6 grid grid-cols-2 gap-6 items-center'>
        <div className='text-center text-gray-500'>
          
          <img src="/pie-chart.png" alt="Pie Chart Here" className="w-32 h-32 mx-auto"/>
        </div>

        <div>
          <p className='text-lg font-semibold'>You've sold so far:</p>
          <p className='text-2xl font-bold text-green-600'>$650</p>
          <p className='mt-2'>Remaining to reach your goal:</p>
          <p className='text-2xl font-bold text-red-500'>$350</p>
        </div>
      </div>
      
      <div className='border border-gray-300 p-6 rounded-2xl shadow-sm bg-white mt-6'>
        <h3 className='text-xl font-semibold mb-4'>Top-Selling Products</h3>
        <ul className='list-disc pl-5 space-y-2 text-gray-700'>
          <li>Burger - 120 sold</li>
          <li>Pizza - 95 sold</li>
          <li>Soda - 80 sold</li>
        </ul>
      </div>
      
    </div>
  );
};

export default Home;
