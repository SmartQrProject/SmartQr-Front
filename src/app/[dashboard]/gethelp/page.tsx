import GetHelp from '@/components/adminComponents/getHelp/GetHelp'
import MenuAdmin from '@/components/adminComponents/menudesplegabe/MenuAdmin'
import NavbarAdmin from '@/components/adminComponents/navbar/NavbarAdmin'
import Footer from '@/components/subscribers/footer/Footer'
import React from 'react'

const page = () => {
  return (
   <div className="flex flex-col min-h-screen">
      <NavbarAdmin />
      
      
      <div className="flex flex-1">
          <MenuAdmin />
          <GetHelp/>
     </div>

      <Footer />
    </div>
  )
}

export default page