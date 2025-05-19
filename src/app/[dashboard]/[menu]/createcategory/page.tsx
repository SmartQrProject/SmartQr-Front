import FooterAdmin from '@/components/adminComponents/footer/Footer'
import CreateCategoryForm from '@/components/adminComponents/menu/forms/CreateCategoryForm'
import Sidebar from '@/components/adminComponents/menu/sidebar/sidebar'
import CategoriesList from '@/components/adminComponents/menu/views/CategoryView'
import MenuAdmin from '@/components/adminComponents/menudesplegabe/MenuAdmin'
import NavbarAdmin from '@/components/adminComponents/navbar/NavbarAdmin'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarAdmin />
      <div className="flex flex-1 flex-col lg:flex-row">
        <MenuAdmin />
        <div className="flex-1 p-4">
          <h1 className="text-2xl mb-4">Menu</h1>
          <Sidebar />
          <h1 className="text-xl font-semibold ">Categories</h1>

          <div className="flex flex-col lg:flex-row lg:justify-center lg:items-start gap-6">
            <CategoriesList />
            <CreateCategoryForm />
          </div>

        </div>
      </div>
      <FooterAdmin />
    </div>
  );
};

export default page;
