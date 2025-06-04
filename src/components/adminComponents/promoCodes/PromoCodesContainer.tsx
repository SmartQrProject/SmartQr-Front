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
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white shadow rounded-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
            Promo Codes Management
          </h2>
          <PromoCodeForm onCodeCreated={handleRefresh} />
        </div>

        <div className="flex-1 bg-white shadow rounded-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
            Promo Codes List
          </h2>
          <PromoCodesList refreshTrigger={refresh} />
        </div>
      </div>
    </div>
  );
};

export default PromoCodesContainer;
