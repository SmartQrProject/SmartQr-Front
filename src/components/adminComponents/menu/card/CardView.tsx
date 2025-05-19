import React from 'react';

interface CardViewProps {
  name: string;
  description: string;
  price: number;
  file?: string;
  details: string[];
  is_available: boolean;
  categoryId: string;
}

const CardView: React.FC<CardViewProps> = ({
  name,
  description,
  price,
  file,
  details,
  is_available,
  categoryId,
}) => {
  const imageUrl = React.useMemo(() => {
    if (!file) return undefined;
    if (typeof file === 'string') return file;
    return URL.createObjectURL(file);
  }, [file]);

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div className="flex flex-row gap-6 p-4 bg-default-100 rounded-2xl shadow-md">
        {/* Text content */}
        <div className="flex flex-col justify-between w-2/3 gap-2">
          <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-700 line-clamp-3">{description}</p>
          <p className="text-lg font-bold text-default-800">${Number(price).toFixed(2)}</p>
          <p className="text-xs text-gray-600">Available: {is_available ? 'Yes' : 'No'}</p>
          {details.length > 0 && (
            <ul className="text-sm text-default-700 mt-2 list-disc list-inside italic">
              {details.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Image preview */}
        <div className="w-1/3 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Product preview"
              className="w-[120px] h-[120px] object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-[120px] h-[120px] bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
              No image
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardView;
