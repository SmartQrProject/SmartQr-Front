import React, { useState } from 'react';

interface AddressInputProps {
  onSelect: (address: string, coords: [number, number]) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length < 3) return;

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        text
      )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&autocomplete=true&types=address`
    );
    const data = await res.json();
    setResults(data.features);
  };

  const handleSelect = (place: any) => {
    setQuery(place.place_name);
    setResults([]);
    onSelect(place.place_name, place.geometry.coordinates); // [lng, lat]
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Ingresa una dirección"
        className="border rounded px-3 py-2 w-full"
      />
      {results.length > 0 && (
        <ul className="border rounded mt-1 bg-white shadow">
          {results.map((place) => (
            <li
              key={place.id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(place)}
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressInput;
