
import StorePageClient from "@/components/adminComponents/editableRestaurant/landingPage/StorePageAdmin";
import MenuAdmin from "@/components/adminComponents/menudesplegabe/MenuAdmin";

import NavbarAdmin from "@/components/adminComponents/navbar/NavbarAdmin";
import Footer from "@/components/subscribers/footer/Footer";

export default function StorePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarAdmin />
      
      
      <div className="flex flex-1">
          <MenuAdmin />
           <main className="flex-1">
              <StorePageClient />

           </main>
         

      </div>

      <Footer />
    </div>
  );
}

