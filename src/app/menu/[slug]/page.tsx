import { notFound } from 'next/navigation';
import StorePageClient from '@/components/clientFacingComponents/StorePageClient';
import { getRestaurantWithMenu } from '@/helper/restaurantsSlugFetch';
import Footer from '@/components/subscribers/footer/Footer';
import NavbarCustomer from '@/components/customers/navbarCustomer/NavbarCustomer';

export default async function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getRestaurantWithMenu(slug);

  if (!data) return notFound();

  return (
    <div className="flex flex-col min-h-screen bg-sienna-50/20">
      <NavbarCustomer slug={slug} name={data.name} />
      <div className="flex-1">
        <StorePageClient data={data} slug={slug} />
      </div>
      <Footer />
    </div>
  );
}
