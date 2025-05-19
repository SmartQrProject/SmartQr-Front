import React from 'react'

interface CardViewProps {
  name: string
  description: string
  price: number
  file?: string
  details: string[]
  is_available: boolean
  categoryId: string
}

const CardView: React.FC<CardViewProps> = ({
  name,
  description,
  price,
  file,
  details,
  is_available,
  categoryId
}) => {
  const imageUrl = React.useMemo(() => {
    if (!file) return undefined
    if (typeof file === "string") return file
    return URL.createObjectURL(file)
  }, [file])

  return (
    <div className="w-full max-w-2xl mx-auto ">
      <div className="flex items-center gap-7 w-[500px] rounded-lg p-4 bg-default-100">

        <div className="flex flex-col gap-8 w-[600px]">
          <h2 className="text-base font-semibold text-gray-900 mb-1">{name}</h2>
          <p className="text-md text-default-800 mb-1 line-clamp-2">{description}</p>
          <p className="text-md font-semibold text-gray-900 mb-2">$ {price}</p>
          {/* <p className="text-xs text-gray-500">Category: {categoryId}</p> */}
          <p className="text-xs text-gray-800">Available: {is_available ? 'Yes' : 'No'}</p>
          {details.length > 0 && (
            <ul className="text-md text-default-700 w-full mt-2 italic ">
              {details.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          {file && <img src={imageUrl} alt="Product preview" className="w-full h-auto rounded-lg" />}  

        </div>

      </div>
    </div>
  )
}

export default CardView
