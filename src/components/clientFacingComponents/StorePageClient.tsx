'use client';


import BannerHero from '../shared/bannerHero';
import PublicCategoryList from '../shared/categoryList';
import PublicCategoryNav from '../shared/categoryNavBar';

interface Product {
  name: string;
  description: string;
  price: number;
  image_url?: string;
  details?: string[];
}

interface Category {
  name: string;
  products: Product[];
}

interface StoreData {
  name: string;
  banner?: string;
  categories: Category[];
}

interface StorePageClientProps {
  data: StoreData;
}

export default function StorePageClient({ data }: StorePageClientProps) {
  return (
   
    <>
     
      <BannerHero imageUrl={data.banner} title={data.name} />
      <PublicCategoryNav categories={data.categories} />
      <PublicCategoryList categories={data.categories} />
     
    </>

     
   
  )
}
