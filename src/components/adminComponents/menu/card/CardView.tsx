import React from "react";

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
    if (typeof file === "string") return file;
    return URL.createObjectURL(file);
  }, [file]);

  return (
    <div className="w-full">
      <div className="flex gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100">
        {/* Image */}
        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-200">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Product preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between text-sm w-full">
          <div>
            <h3 className="text-base font-semibold text-gray-900 leading-snug">
              {name}
            </h3>
            <p className="text-gray-600 leading-snug text-sm line-clamp-2 cursor-pointer">
              {description}
            </p>
            {details.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1 text-xs italic text-gray-700">
                {details.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 px-2 py-0.5 rounded-full text-[11px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-600">
              Available: {is_available ? "Yes" : "No"}
            </p>
            <p className="text-sm font-bold text-default-800">
              ${Number(price).toFixed(2)}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CardView;
