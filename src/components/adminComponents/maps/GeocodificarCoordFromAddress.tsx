export const getCoordsFromAddress = async (address: string): Promise<[number, number] | null> => {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}&limit=1&types=address`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.features && data.features.length > 0) {
      return data.features[0].center; 
    }
  } catch (error) {
    console.error('Error geocoding:', error);
  }
  return null;
};
