'use client'
import Link from 'next/link'
import React from 'react'
import {HiOutlineHome, HiOutlineShoppingBag, HiOutlineBuildingStorefront, HiOutlineCog6Tooth, HiOutlineChartBar} from 'react-icons/hi2'
import { GiKnifeFork } from 'react-icons/gi'

const MenuAdmin = () => {
  
  return (
    <div className=' w-64 p-4 '>
      <div className='flex flex-col space-y-4'>
        
        <div className='space-y-0 '>
          <h1 className='font-semibold text-lg'>Name</h1>
          <span className='text-md'>Restaurant</span>          
        </div>
        
        <Link href={"/dashboardAdmin"} className='flex items-center gap-2 py-2 px-4 rounded-3xl hover:bg-[#9CA3AF] '><HiOutlineHome/>Home</Link>
        
        <Link href={"/dashboardAdmin/stores"} className='flex items-center gap-2 py-2 px-4 rounded-3xl hover:bg-[#9CA3AF] '><HiOutlineBuildingStorefront/>Stores</Link>
        
        <Link href={"/dashboardAdmin/orders"} className='flex items-center gap-2 py-2 px-4 rounded-3xl hover:bg-[#9CA3AF]'><HiOutlineShoppingBag/>Orders</Link>
        
        <Link href={"/dashboardAdmin/reports"} className='flex items-center gap-2 py-2 px-4 rounded-3xl hover:bg-[#9CA3AF]'><HiOutlineChartBar/>Reports</Link>
        
        <Link href={"/dashboardAdmin/menu"} className='flex items-center gap-2 py-2 px-4 rounded-3xl hover:bg-[#9CA3AF] '><GiKnifeFork />Menu</Link>
        
        <Link href={"/dashboardAdmin/settings"} className='flex items-center gap-2 py-2 px-4 rounded-3xl hover:bg-[#9CA3AF]'><HiOutlineCog6Tooth/>Settings</Link>

        
      </div>
    </div>
  );
};
export default MenuAdmin;