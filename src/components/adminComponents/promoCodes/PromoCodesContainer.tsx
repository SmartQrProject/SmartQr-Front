'use client';

import { useState } from "react";
import PromoCodeForm from "./PromoCodesForm";
import PromoCodesList from "./ListPromoCode";

const PromoCodesContainer = () => {
  const [refresh, setRefresh] = useState(0);

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="w-full md:w-1/2 mb-6 md:mb-0 bg-white shadow rounded-md p-6">
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
            Promo Codes Management
          </h1>
          <PromoCodeForm onCodeCreated={handleRefresh} />
        </div>

        <div className="w-full md:w-1/2 bg-white shadow rounded-md p-6">
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
            Promo codes list
          </h1>
          <PromoCodesList refreshTrigger={refresh} />
        </div>
      </div>
    </div>
  );
};

export default PromoCodesContainer;
