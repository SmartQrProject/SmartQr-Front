import React from 'react'
import LoginForm from './adminLoginForm'

const AdminRegisterPage = () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-default-100">
     
      <div className="w-full md:w-[70%] h-64 md:h-auto">
        <img
          src={`https://res.cloudinary.com/${cloudName}/image/upload/lzbnhd8s0445epswfwim.jpg`}
          alt="Admin registration"
          className="object-cover w-full h-full"
        />
      </div>

      
      <div className="w-full md:w-[30%] p-8 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#4f89f5] ">Welcome Back</h2>
        <LoginForm/>
      </div>
    </div>
  )
}

export default AdminRegisterPage