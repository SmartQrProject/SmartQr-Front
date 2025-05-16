import FooterAdmin from '@/components/adminComponents/footer/Footer'
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

        <main className="p-4">
          <h1 className='text-2xl'>Menu</h1>
          <Sidebar/>
          <h1 className='text-2xl'>MODIFY PRODUCT</h1>
        </main>
      </div>

      <FooterAdmin />
    </div>
  );
};


export default page
