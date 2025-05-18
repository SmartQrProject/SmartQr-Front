import React from 'react'
import CardView from "../card/CardView"

import { ProductPreviewProps } from "../menuTypes/menuTypes"


const ProductPreview: React.FC<ProductPreviewProps> = ({ preview }) => {
  return (
    <div className="w-full max-w-sm p-4">
      <CardView
        name={preview.name}
        description={preview.description}
        price={preview.price}
        file={preview.imageUrl}
        detail={preview.detail}
        available={preview.available}
        categoryId={preview.categoryId}
      />
    </div>
  )
}

export default ProductPreview
