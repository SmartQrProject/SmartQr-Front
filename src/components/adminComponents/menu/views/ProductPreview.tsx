import React from 'react'
import CardView from "../card/CardView"

import { ProductPreviewProps } from "../menuTypes/menuTypes"


const ProductPreview: React.FC<ProductPreviewProps> = ({ preview }) => {
  return (
    <div className="w-full max-w-md mx-auto rounded-md">
      <CardView
        name={preview.name}
        description={preview.description}
        price={preview.price}
        file={preview.imageUrl}
        details={preview.details ?? []} // <- Esto asegura que sea string[]
        is_available={preview.is_available ?? false}
        categoryId={preview.categoryId}
      />
    </div>
  )
}

export default ProductPreview
