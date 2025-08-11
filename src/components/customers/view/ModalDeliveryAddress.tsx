"use client";

import React from "react";
import AddressInput from "@/components/adminComponents/maps/AddressInput";
import { CgClose } from "react-icons/cg";
import { useRouter } from "next/navigation";

interface DeliveryAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  useDefaultAddress: boolean;
  setUseDefaultAddress: (useDefault: boolean) => void;
  selectedAddress: { full: string; coords?: number[] } | null;
  setSelectedAddress: (address: { full: string; coords?: number[] } | null) => void;
  defaultAddress?: string | null;
  onCheckout: () => void;
}

export default function DeliveryAddressModal({
  isOpen,
  onClose,
  useDefaultAddress,
  setUseDefaultAddress,
  selectedAddress,
  setSelectedAddress,
  defaultAddress,
  onCheckout,
}: DeliveryAddressModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const hasDefaultAddress = !!defaultAddress && defaultAddress.trim() !== "";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative bg-white rounded-xl p-6 shadow-lg max-w-sm sm:max-w-md w-full pointer-events-auto z-10">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          title="Close"
        >
          <CgClose className="h-6 w-6" />
        </button>

        <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={useDefaultAddress}
            onChange={() => setUseDefaultAddress(true)}
            className="cursor-pointer"
          />
          Use my default address
        </label>

       
        {useDefaultAddress && !hasDefaultAddress && (
          <div className="mb-4 px-6 py-2 text-sm bg-gray-100 rounded ml-6 mt-1">
            <p className="mb-2 text-gray-600">
              No default address found. Please update your profile with a delivery address.
            </p>
            <button
              onClick={() => {
                onClose();
                router.push("/customer/dashboard/edit");
              }}
              className="text-blue-900 hover:text-blue-300 font-semibold underline cursor-pointer "
            >
              Go to Profile
            </button>
          </div>
        )}

        {useDefaultAddress && hasDefaultAddress && (
          <p className="text-sm text-gray-600 ml-6 mt-1">{defaultAddress}</p>
        )}

        <label className="flex items-center gap-2 mt-3 cursor-pointer">
          <input
            type="radio"
            checked={!useDefaultAddress}
            onChange={() => setUseDefaultAddress(false)}
            className="cursor-pointer"
          />
          Enter a new address
        </label>

        {!useDefaultAddress && (
          <div className="mt-3">
            <AddressInput
              onSelect={(address, coords) => setSelectedAddress({ full: address, coords })}
            />
            {selectedAddress?.full && (
              <p className="text-sm text-gray-600 mt-2">Selected: {selectedAddress.full}</p>
            )}
          </div>
        )}

        <button
          onClick={() => {
            onCheckout();
            onClose();
          }}

          disabled={useDefaultAddress && !hasDefaultAddress}
          className={`mt-6 w-full py-2 rounded-lg font-semibold text-white ${
            useDefaultAddress && !hasDefaultAddress
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-branding-500 hover:bg-branding-600"
          }`}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
