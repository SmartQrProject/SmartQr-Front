import ListProducts from '@/components/adminComponents/menu/views/ListProductsView'
import NavbarCustomer from '@/components/customers/navbarCustomer/NavbarCustomer'
import CustomerProfile from '@/components/customers/Profile'
import React from 'react'

const CustomerProfilePage = () => {
  return (
    <>
    <NavbarCustomer/>
    
        <CustomerProfile/>
        <ListProducts/>
    </>
  )
}

export default CustomerProfilePage