import React, { useEffect, useState } from 'react';

interface AddressInputProps {
  onSelect: (address: string, coords: [number, number]) => void;
  value?: string;
}

const AddressInput: React.FC<AddressInputProps> = ({ onSelect, value }) => {
  const [query, setQuery] = useState(value || '');

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

  useEffect(() => {
  setQuery(value || '');
  }, [value]);


  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Enter an Address"
        className="rounded px-3 py-2 w-full bg-neutral-100 text-sm"
      />
      {Array.isArray(results) && results.length > 0 ? (
        results[0].place_name ? (
          <ul className="rounded mt-1 bg-white shadow">
            {results.map((place) => (
              <li
                key={place.id}
                className="rounded mt-1 p-2 hover:bg-gray-100 z-10"
                onClick={() => handleSelect(place)}
              >
                {place.place_name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No results found</p>
        )
      ) : null}

    </div>
  );
};

export default AddressInput;
