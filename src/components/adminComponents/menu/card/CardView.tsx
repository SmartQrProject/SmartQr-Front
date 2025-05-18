import React from 'react'

interface CardViewProps {
  name: string
  description: string
  price: number
  file?: string
  detail: string[]
  available: boolean
  categoryId: string
}

const CardView: React.FC<CardViewProps> = ({
  name,
  description,
  price,
  file,
  detail,
  available,
  categoryId
}) => {
  const imageUrl = React.useMemo(() => {
    if (!file) return undefined
    if (typeof file === "string") return file
    return URL.createObjectURL(file)
  }, [file])

  return (
    <div className="flex justify-center p-4 w-full sm:w-20 md:w-96 lg:w-[22rem] m-auto">
      <div className="flex items-center rounded-2xl shadow-lg p-4 gap-4 hover:shadow-md hover:scale-105 transition-transform duration-200 w-full bg-white">

        <div className="flex flex-col justify-between w-full">
          <h2 className="text-base font-semibold text-gray-900 mb-1">{name}</h2>
          <p className="text-sm text-gray-700 mb-1 line-clamp-2">{description}</p>
          <p className="text-sm font-semibold text-gray-900 mb-2">$ {price}</p>
          <p className="text-xs text-gray-500">Category: {categoryId}</p>
          <p className="text-xs text-gray-500">Available: {available ? 'Yes' : 'No'}</p>
          {detail.length > 0 && (
            <ul className="text-xs text-left text-gray-600 w-full mt-2 pl-4 list-disc">
              {detail.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        {file && <img src={imageUrl} alt="Product preview" className="w-full h-auto" />}

      </div>
    </div>
  )
}

export default CardView
