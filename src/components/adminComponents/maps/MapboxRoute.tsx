import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface RouteProps {
  origin: [number, number];
  destination: [number, number];
}

const MapboxRoute: React.FC<RouteProps> = ({ origin, destination }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: origin,
      zoom: 13,
    });

    mapRef.current = map;

    map.on('load', async () => {
      const res = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.join(',')};${destination.join(',')}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      const route = data.routes[0].geometry;

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: route,
        },
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 5,
        },
      });

      map.addControl(new mapboxgl.NavigationControl());
    });

    return () => map.remove();
  }, [origin, destination]);

  return <div ref={mapContainer} className="w-full h-96 rounded-xl shadow-lg" />;
};

export default MapboxRoute;
