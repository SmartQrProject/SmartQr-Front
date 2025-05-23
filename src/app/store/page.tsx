
import StorePageAdmin from "@/components/adminComponents/editableRestaurant/landingPage/StorePageAdmin";
import NavbarAdmin from "@/components/adminComponents/navbar/NavbarAdmin";
import Footer from "@/components/subscribers/footer/Footer";

export default function StorePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarAdmin />
    
      <div className="flex-1">
        <StorePageAdmin />
      </div>

      <Footer />
    </div>
  );
}

