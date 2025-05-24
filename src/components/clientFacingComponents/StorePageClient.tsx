'use client';


import { useEffect } from 'react';
import BannerHero from '../shared/bannerHero';
import PublicCategoryList from '../shared/categoryList';
import PublicCategoryNav from '../shared/categoryNavBar';

interface Product {
  id: string;
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
  slug: string;
}

export default function StorePageClient({ data, slug }: StorePageClientProps) {

    useEffect(() => {
    if (slug) {
      localStorage.setItem("slug", slug);
    }if (data.name) {
      localStorage.setItem('storeName', data.name);
    }
  }, [slug, data.name]);
  return (
   
    <>
     
      <BannerHero imageUrl={data.banner} title={data.name} />
      <PublicCategoryNav categories={data.categories} />
      <PublicCategoryList categories={data.categories} slug={slug} />
     
    </>

     
   
  )
}
