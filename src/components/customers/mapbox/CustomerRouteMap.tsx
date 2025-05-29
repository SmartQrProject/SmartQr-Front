'use client';
import MapboxRoute from '@/components/adminComponents/maps/MapboxRoute';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface CustomerRouteMapProps {
  destination: [number, number];
}

const CustomerRouteMap: React.FC<CustomerRouteMapProps> = ({ destination }) => {
  const [origin, setOrigin] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error('Your browser does not support geolocation');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOrigin([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        toast.error('Could not get your location. Make sure to allow the permission.');
      }
    );
  }, []);

  if (!origin) {
    return <p className="text-sm text-gray-500 mt-4">Getting your location…</p>;
  }

  return <MapboxRoute origin={origin} destination={destination} />;
};

export default CustomerRouteMap;
