'use client';
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import toast from 'react-hot-toast';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface RouteProps {
  origin: [number, number];
  destination: [number, number];
}

const MapboxRoute: React.FC<RouteProps> = ({ origin, destination }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const calcularDistancia = (
    [lng1, lat1]: [number, number],
    [lng2, lat2]: [number, number]
  ): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const distancia = calcularDistancia(origin, destination);
    const zoom = distancia < 5000 ? 5 : 2;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: destination,
      zoom,
    });

    mapRef.current = map;

    map.on('load', async () => {

      new mapboxgl.Marker({ color: 'blue' })
        .setPopup(new mapboxgl.Popup().setText('Tu ubicación'))
        .setLngLat(origin)
        .addTo(map);

      new mapboxgl.Marker({ color: 'red' })
        .setLngLat(destination)
        .setPopup(
          new mapboxgl.Popup().setHTML(`
          <strong>Restaurante</strong><br />
          <a href="https://www.google.com/maps/dir/?api=1&destination=${destination[1]},${destination[0]}" target="_blank" rel="noopener noreferrer">
            Abrir en Google Maps
          </a>
        `)
        )
        .addTo(map);

      map.addControl(new mapboxgl.NavigationControl());

      if (distancia < 5000) {
        const res = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.join(',')};${destination.join(',')}?geometries=geojson&access_token=${mapboxgl.accessToken}`
        );
        const data = await res.json();
        const route = data.routes?.[0]?.geometry;

        if (route) {
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
        }
      } else {
        toast.error("The restaurant is over 5000 km away, so the route can't be calculated.");
      }
    });

    return () => map.remove();
  }, [origin, destination]);

  return <div ref={mapContainer} className="w-full h-96 rounded-xl shadow-lg" />;
};

export default MapboxRoute;
