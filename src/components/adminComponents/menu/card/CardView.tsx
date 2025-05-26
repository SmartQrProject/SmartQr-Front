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
      <div className="flex flex-row gap-4 p-4 bg-white rounded-2xl h-[160px]">
        {/* Image section */}
        <div className="w-1/3 h-full ">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Product preview"
              className="w-full h-full object-cover rounded-xl border border-gray-200"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-500">
              No image
            </div>
          )}
        </div>

        {/* Text section */}
        <div className="w-2/3 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{name}</h2>
            <p className="text-sm text-gray-700 line-clamp-2">{description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-default-700 italic mt-2">
            {details.map((item, idx) => (
              <span key={idx} className="bg-gray-100 px-2 py-1 rounded-full">
                {item}
              </span>
            ))}
          </div>

          <div className="text-sm text-gray-600">
            Available: {is_available ? 'Yes' : 'No'}
          </div>

          <div className="text-base font-bold text-default-800">
            ${Number(price).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardView;
