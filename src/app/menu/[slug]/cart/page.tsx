import React from 'react';
import { notFound } from 'next/navigation';

import FooterAdmin from '@/components/adminComponents/footer/Footer';
import NavbarCustomer from '@/components/customers/navbarCustomer/NavbarCustomer';
import CartView from '@/components/customers/view/CartView';
import { getRestaurantWithMenu } from '@/helper/restaurantsSlugFetch';

interface CartProps {
  params: Promise<{ slug: string }>;
}

export default async function Cart({ params }: CartProps) {
  const { slug } = await params;
  const data = await getRestaurantWithMenu(slug);

  if (!data) return notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarCustomer slug={slug} name={data.name} />

      <main className="flex-grow p-4">
        <h2 className="text-2xl mb-4 text-center font-semibold">Shopping Cart</h2>
        <CartView />
      </main>

      <FooterAdmin />
    </div>
  );
}
