import FooterAdmin from '@/components/adminComponents/footer/Footer'
import MenuAdmin from '@/components/adminComponents/menudesplegabe/MenuAdmin'
import NavbarAdmin from '@/components/adminComponents/navbar/NavbarAdmin'
import OrdersView from '@/components/adminComponents/orders/view/OrdersView'
import React from 'react'

const orders = () => {
    return (
        <div className='min-h-screen flex flex-col bg-gray-200'>
            <NavbarAdmin/>
        
            <div className="flex flex-1">
                <MenuAdmin/>
                <main className="flex-1 p-4">        

                    <OrdersView/>
                    
                    
                    
                </main>
            </div>
            <FooterAdmin/>         

            </div>
  )
}

export default orders