'use client';
import React from 'react';
import { XIcon } from 'lucide-react';
import { IRestaurant } from '@/types';
import MapRenderer from '../adminComponents/maps/MapRenderer';


type PublicStoreInfoModalProps = {
  open: boolean;
  onClose: () => void;
  restaurant: IRestaurant | null;
};

const PublicStoreInfoModal = ({ open, onClose, restaurant }: PublicStoreInfoModalProps) => {
  if (!open || !restaurant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-xl p-6 mx-4 border border-black bg-white shadow-lg overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-900 hover:text-red-500 cursor-pointer"
          aria-label="Close"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <span className="text-xl font-bold mb-1">Store Info</span>

        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium mb-1">
              {restaurant.address || 'Address'}
            </span>
            {restaurant.latitude && restaurant.longitude && (
              <div className="mt-4">
                <MapRenderer coords={[restaurant.longitude, restaurant.latitude]} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col space-y-4">
            <div>
              <span className="text-xl font-medium">{restaurant.name}</span>
            </div>

            {restaurant && restaurant.tags && restaurant.tags.map(tag => (
  <span key={tag}>{tag}</span>
))}
            {restaurant.description?.trim() && (
              <div>
                <span className="text-md mb-1">{restaurant.description}</span>
              </div>
            )}

            {restaurant.phone?.trim() && (
              <div>
                <span className="text-lx text-gray-500">Need help?</span>
                <br />
                <span className="text-md mb-1">
                  If you have any questions about the menu, allergens, or ordering, call us on {restaurant.phone}
                </span>
              </div>
            )}

            {restaurant.trading_hours && (
              (restaurant.trading_hours.mondayToFriday?.open ||
                restaurant.trading_hours.mondayToFriday?.close ||
                restaurant.trading_hours.saturday?.open ||
                restaurant.trading_hours.saturday?.close ||
                restaurant.trading_hours.sunday?.open ||
                restaurant.trading_hours.sunday?.close) && (
                <div>
                  <span className="text-lx text-gray-500">Trading hours</span>
                  <div className="text-md mb-1">
                    {(restaurant.trading_hours.mondayToFriday?.open ||
                      restaurant.trading_hours.mondayToFriday?.close) && (
                      <div>
                        Monday to Friday: {restaurant.trading_hours.mondayToFriday.open} -{' '}
                        {restaurant.trading_hours.mondayToFriday.close}
                      </div>
                    )}
                    {(restaurant.trading_hours.saturday?.open ||
                      restaurant.trading_hours.saturday?.close) && (
                      <div>
                        Saturday: {restaurant.trading_hours.saturday.open} -{' '}
                        {restaurant.trading_hours.saturday.close}
                      </div>
                    )}
                    {(restaurant.trading_hours.sunday?.open ||
                      restaurant.trading_hours.sunday?.close) && (
                      <div>
                        Sunday: {restaurant.trading_hours.sunday.open} -{' '}
                        {restaurant.trading_hours.sunday.close}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {restaurant.ordering_times && (restaurant.ordering_times.pickup || restaurant.ordering_times.dinein) && (
              <div>
                <span className="text-lx text-gray-500">Ordering times</span>
                <div className="text-md mb-1">
                  {restaurant.ordering_times.pickup && (
                    <div>Pickup: {restaurant.ordering_times.pickup}</div>
                  )}
                  {restaurant.ordering_times.dinein && (
                    <div>Dine-in: {restaurant.ordering_times.dinein}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicStoreInfoModal;
