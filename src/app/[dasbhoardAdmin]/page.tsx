
import FooterAdmin from '@/components/adminComponents/footer/Footer'
import HomeAdmin from '@/components/adminComponents/home/HomeAdmin'
import MenuAdmin from '@/components/adminComponents/menudesplegabe/MenuAdmin'
import NavbarAdmin from '@/components/adminComponents/navbar/NavbarAdmin'
import React from 'react'

const Home = () => {
  return (
    <div className='min-h-screen flex flex-col bg-gray-200'>
      <NavbarAdmin/>
   
      <div className="flex flex-1">
          <MenuAdmin/>
          <main className="flex-1 p-4">        

            <HomeAdmin/>       
            
            
          </main>
      </div>
      <FooterAdmin/>         

    </div>
  )
}

export default Home