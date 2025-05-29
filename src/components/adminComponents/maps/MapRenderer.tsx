'use client';
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface MapRendererProps {
  coords: [number, number];
}

const MapRenderer: React.FC<MapRendererProps> = ({ coords }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coords,
      zoom: 14,
    });

    new mapboxgl.Marker().setLngLat(coords).addTo(map);

    return () => map.remove();
  }, [coords]);

  return <div ref={mapRef} className="w-full h-100 rounded-lg shadow " />;
};

export default MapRenderer;
