'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { HiOutlineBell } from 'react-icons/hi'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

const NavbarAdmin = () => {

  const [open, setOpen] = useState(false)

  return (
    
    <div >
        <nav className='m-5 '>

            <div className='flex justify-between items-center '>
                <Link className='text-[#6494ED] font-bold text-xl ' href={'/'}>SmartQR</Link>

                <button className='sm:hidden text-2xl ' onClick={() => setOpen(!open)}>☰</button>
                
                <div className='hidden sm:flex space-x-4 items-center '>
                    <Link className='py-2 px-4 bg-[#9CA3AF] rounded-3xl border border-transparent hover:border-white flex items-center' href={'/'}> <AiOutlineQuestionCircle className="mr-2"/> Get Help</Link>
                    <Link className='hover:text-[#9CA3AF]' href={'/'}><HiOutlineBell/></Link>
                    <Link className='hover:text-[#9CA3AF]' href={'/'}>FAQ</Link>
                    <Link className='py-2 px-4  rounded-3xl border border-transparent hover:border-[#9CA3AF] ' href={'/'}>Log out</Link>
                </div>
            </div>
            
            {open && (
                <div className='flex flex-col space-y-2 mt-4 sm:hidden justify-end'>
                    <Link className='py-2 px-4 bg-[#9CA3AF] rounded-3xl border border-transparent hover:border-white w-fit' href={'/'}>Get Help</Link>
                    <Link className='hover:text-[#9CA3AF]' href={'/'}><HiOutlineBell/></Link>
                    <Link className='hover:text-[#9CA3AF]' href={'/'}>FAQ</Link>
                    <Link className='py-2 px-6 rounded-3xl border border-transparent hover:border-[#9CA3AF]  w-fit ' href={'/'}>Log out</Link>
                </div>
            )}
        </nav>
    </div>
  )
}

export default NavbarAdmin
