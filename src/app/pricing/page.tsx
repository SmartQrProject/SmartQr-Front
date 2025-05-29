import Hero from "@/components/adminComponents/landingPage/heroComponent/Hero";
import Pricing from "@/components/gabriel/Pricing";
import Footer from "@/components/subscribers/footer/Footer";
import Navbar from "@/components/subscribers/navbar/Navbar";
import React from "react";

const PricingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
     
      <Navbar />

      <main className="flex-grow">
        <Pricing />
      </main>

   
      <Footer />
    </div>
  );
};

export default PricingPage;
