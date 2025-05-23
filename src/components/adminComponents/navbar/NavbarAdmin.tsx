'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { HiOutlineBell } from 'react-icons/hi'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { IoClose } from 'react-icons/io5'
import { useAuth } from '@/app/(admin)/login/adminLoginContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useUserRole } from '../hooks/useUserRole'

const NavbarAdmin = () => {
  const [open, setOpen] = useState(false)
  const { logoutAdmin } = useAuth()
  const router = useRouter()
  
  const role = useUserRole();
  const validRoles = ["owner", "staff"] as const;
  if (role === undefined) return <div>Loading...</div>;
  if (!validRoles.includes(role as any)) return <div>No autorizado</div>;
    
  const logOutHandler = () => {
    logoutAdmin()
    toast.success("Logout successful")

    router.push("/")
  }

  return (
    <div>
      <nav className='m-5'>
        <div className='flex justify-between items-center'>
          <Link className='text-[#6494ED] font-bold text-xl' href={'/'}>SmartQR</Link>
          
          <button className='sm:hidden text-2xl' onClick={() => setOpen(true)}>☰</button>

          <div className='hidden sm:flex items-center space-x-4'>
            <Link className='py-2 px-4 rounded-3xl border border-transparent hover:bg-[#9CA3AF] hover:border-white flex items-center' href={'/'}><AiOutlineQuestionCircle className="mr-2" /> Get Help</Link>

            {role === 'owner' && (
              <>
                <Link className='py-2 px-4 rounded-3xl border border-transparent hover:bg-[#9CA3AF] hover:border-white' href={'/dashboard'}>Dashboard</Link>
              </>
            )}
            <Link className='py-2 px-4 rounded-3xl border border-transparent hover:bg-[#9CA3AF] hover:border-white' href={'/'}><HiOutlineBell /></Link>
            <button onClick={logOutHandler} className='py-2 px-4 rounded-3xl border border-transparent hover:bg-[#9CA3AF] hover:border-white'>Log out</button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="sm:hidden fixed top-0 right-0 h-screen w-50 bg-white shadow-lg z-50 p-6 transition-transform duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Options</h2>
            <button onClick={() => setOpen(false)}>
              <IoClose className="text-2xl  " />
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            <Link className='py-1 px-4 rounded-3xl hover:bg-gray-300 w-30' href={'/'}>Get Help</Link>
            <Link className='py-2 px-4 rounded-3xl hover:bg-gray-300 w-30' href={'/'}><HiOutlineBell /></Link>
            {role === 'owner' && (
              <><Link className='py-2 px-4 rounded-3xl border border-transparent hover:bg-[#9CA3AF] hover:border-white' href={'/dashboard'}>Dashboard</Link></>
            )}
            <button onClick={logOutHandler} className='py-1 px-4 rounded-3xl hover:bg-gray-300 w-30'>Log out</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NavbarAdmin
