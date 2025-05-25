'use client'
import Link from 'next/link'
import React, { useState } from 'react'

const Navbar = () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
    const [open, setOpen] = useState(false)

    return (
        
        <div >
            <nav className='m-5 '>

                <div className='flex justify-between items-center '>
                    <Link className='text-[#6494ED] font-bold text-xl ' href={'/'}><><img src={`https://res.cloudinary.com/${cloudName}/image/upload/logo2_jzvw9b.png`} alt="SmartQR" className='h-16 inline-block rounded-lg' /></></Link>

                    <button className='sm:hidden text-2xl ' onClick={() => setOpen(!open)}>☰</button>
                    <div className='hidden sm:flex space-x-4 items-center '>
                        <Link href={'/features'}>Features</Link>
                        <Link href={'/benefits'}>Benefits</Link>
                        <Link href={'/pricing'}>Pricing</Link>
                        <Link className='py-2 px-6 bg-[#6494ED] text-white rounded-3xl ' href={'/login'}>Sign In</Link>
                    </div>
                </div>
                
                {open && (
                    <div className='flex flex-col space-y-2 mt-4 sm:hidden '>
                        <Link href={'/features'}>Features</Link>
                        <Link href={'/benefits'}>Benefits</Link>
                        <Link href={'/pricing'}>Pricing</Link>
                        <Link className='py-2 px-6 bg-[#6494ED] text-white rounded-3xl w-fit ' href={'/login'}>Sign In</Link>
                    </div>
                )}
            </nav>
        </div>
  )
}

export default Navbar
