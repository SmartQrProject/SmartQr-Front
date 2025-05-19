import CategoryProductList from '@/components/adminComponents/editableRestaurant/landingPage/CategoryProductList'
import FooterAdmin from '@/components/adminComponents/footer/Footer'
import MenuAdmin from '@/components/adminComponents/menudesplegabe/MenuAdmin'
import NavbarAdmin from '@/components/adminComponents/navbar/NavbarAdmin'
import OrdersView from '@/components/adminComponents/orders/view/OrdersView'
import React from 'react'

const orders = () => {
    return (
        <div className='min-h-screen flex flex-col '>
            <NavbarAdmin/>
        
            <div className="flex flex-1">
                <MenuAdmin/>
                <main className="flex-1 p-4">
                    
               
                </main>
            </div>
            <FooterAdmin/>         

            </div>
  )
}

export default orders