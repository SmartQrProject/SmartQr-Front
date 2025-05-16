import FooterAdmin from '@/components/adminComponents/footer/Footer'
import CreateMenuForm from '@/components/adminComponents/menu/forms/CreateMenuForm'
import Sidebar from '@/components/adminComponents/menu/sidebar/sidebar'
import MenuAdmin from '@/components/adminComponents/menudesplegabe/MenuAdmin'
import NavbarAdmin from '@/components/adminComponents/navbar/NavbarAdmin'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <NavbarAdmin />

      <div className="flex flex-1 flex-col lg:flex-row">
        <MenuAdmin />

        <div className="p-4">
          <h1 className='text-2xl'>Menu</h1>
          <Sidebar/>
           <h1 className="text-xl font-semibold ">Create Product</h1>
          <CreateMenuForm />
        </div>
      </div>

      <FooterAdmin />
    </div>
  );
};


export default page
