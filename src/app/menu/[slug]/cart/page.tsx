import FooterAdmin from '@/components/adminComponents/footer/Footer'
import NavbarCustomer from '@/components/customers/navbarCustomer/NavbarCustomer'
import CartView from '@/components/customers/view/CartView'
import { getRestaurantWithMenu } from '@/helper/restaurantsSlugFetch'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function Cart({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getRestaurantWithMenu(slug);

  if (!data) return notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarCustomer slug={slug} name={data.name} />
      
      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex-1 p-4">
          <h1 className="text-2xl mb-4">Shopping Cart</h1>
          <CartView />
        </div>
      </div>
      
      <FooterAdmin />
    </div>
  );
}
