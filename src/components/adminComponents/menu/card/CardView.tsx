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
    <>

      <div className="w-full h-full">
        <div className="flex flex-col justify-between h-full p-4 rounded-2xl bg-white shadow-sm border border-gray-100">
          
          {/* Top Section: Image and Title */}
          <div className="flex gap-4 mb-4">
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

            {/* Title + Description */}
            <div className="flex flex-col justify-between w-full text-sm">
              <div>
                <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-1">
                  {name}
                </h3>
                <p className="text-gray-600 leading-snug text-sm line-clamp-2">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* Details & Price Section */}
          <div className="flex flex-col gap-2 mt-auto">
            {details.length > 0 && (
              <div className="flex flex-wrap gap-1 text-xs italic text-gray-700">
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

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
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
    </>
    );
};

export default CardView;
