'use client';
import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
import { getRestaurantWithMenu } from '@/helper/restaurantsSlugFetch';
import { IRestaurant } from '@/types';
import { getCoordsFromAddress } from '../adminComponents/maps/GeocodificarCoordFromAddress';
import CustomerRouteMap from '../customers/mapbox/CustomerRouteMap';

type StoreInfoModalProps = {
  open: boolean;
  onClose: () => void;
  slug?: string;
};

const PublicStoreInfoModal = ({ open, onClose, slug: slugProp }: StoreInfoModalProps) => {
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [slug, setSlug] = useState<string | null>(slugProp || null);

  useEffect(() => {

    if (!slugProp) {
      const storedSlug = localStorage.getItem("slug");
      setSlug(storedSlug);
    }
  }, [slugProp]);

  useEffect(() => {

    if (!open || !slug) {
      console.log("Aborting fetch, either 'open' is false or 'slug' is missing.");
      setRestaurant(null);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getRestaurantWithMenu(slug);
        if (data) {
          let latitude = data.latitude;
          let longitude = data.longitude;

          if ((!latitude || !longitude) && data.address) {
            const coords = await getCoordsFromAddress(data.address);
            if (coords) {
              [longitude, latitude] = coords;
            }
          }

          const mappedData: IRestaurant = {
            id: data.id,
            name: data.name,
            slug: data.slug,
            owner_email: data.owner_email,
            is_active: data.is_active,
            banner: data.banner,
            address: data.address,
            phone: data.phone,
            description: data.description,
            tags: data.tags || [],
            trading_hours: data.trading_hours,
            ordering_times: data.ordering_times,
            latitude,
            longitude,
          };

          setRestaurant(mappedData);
        }
      } catch (error) {
        console.error("Error fetching restaurant info:", error);
      }
    };

    fetchData();
  }, [open, slug]);

  if (!open || !restaurant) return null;

  return (
      <>
      <div className="fixed inset-0 flex items-center justify-center pointer-events-auto">
        <div className="relative w-full max-w-xl rounded-xl p-6 mx-4 border border-gray-300 bg-white shadow-lg overflow-y-auto">
          <div className="absolute top-3 right-3 flex gap-2">
            
            <button
              onClick={onClose}
              className="text-gray-900 hover:text-red-500 cursor-pointer"
              aria-label="Close"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>          
          <span className="text-xl font-bold mb-1">Store Info</span>

          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium mb-1">{restaurant.address || "Address"}</span>
              {restaurant.latitude && restaurant.longitude && (
                <div className="mt-4">
                    {restaurant.latitude && restaurant.longitude && (
                      <CustomerRouteMap destination={[restaurant.longitude, restaurant.latitude]} />
                    )}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col space-y-4">
              <div>
                <span className="text-xl font-medium">{restaurant.name}</span>
              </div>

              {restaurant.tags && restaurant.tags.length > 0 && (
                <div>
                  <span className="text-md text-gray-500 mb-1"> {restaurant.tags.join(", ")} </span>
                </div>
              )}

              {restaurant.description && restaurant.description.trim() !== "" && (
                <div>
                  <span className="text-md mb-1">{restaurant.description}</span>
                </div>
              )}

              {restaurant.phone && restaurant.phone.trim() !== "" && (
                <div>
                  <span className="text-lx text-gray-500">Need help?</span>
                  <br />
                  <span className="text-md mb-1">
                    If you have any questions about the menu, allergens, or ordering, call us on <span className='text-gray-700 font-bold'>{restaurant.phone}</span>
                  </span>
                </div>
              )}

             {restaurant.trading_hours && (
                (restaurant.trading_hours.mondayToFriday?.open || restaurant.trading_hours.mondayToFriday?.close ||
                restaurant.trading_hours.saturday?.open || restaurant.trading_hours.saturday?.close ||
                restaurant.trading_hours.sunday?.open || restaurant.trading_hours.sunday?.close) && (
                  <div>
                    <span className="text-lx text-gray-500">Trading hours</span>
                    <div className="text-md mb-1">
                      {(restaurant.trading_hours.mondayToFriday?.open || restaurant.trading_hours.mondayToFriday?.close) && (
                        <div>
                          Monday to Friday: {restaurant.trading_hours.mondayToFriday.open} - {restaurant.trading_hours.mondayToFriday.close}
                        </div>
                      )}
                      {(restaurant.trading_hours.saturday?.open || restaurant.trading_hours.saturday?.close) && (
                        <div>
                          Saturday: {restaurant.trading_hours.saturday.open} - {restaurant.trading_hours.saturday.close}
                        </div>
                      )}
                      {(restaurant.trading_hours.sunday?.open || restaurant.trading_hours.sunday?.close) && (
                        <div>
                          Sunday: {restaurant.trading_hours.sunday.open} - {restaurant.trading_hours.sunday.close}
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
                    {restaurant.ordering_times.pickup && <div>Pickup: {restaurant.ordering_times.pickup}</div>}
                    {restaurant.ordering_times.dinein && <div>Dine-in: {restaurant.ordering_times.dinein}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicStoreInfoModal;
