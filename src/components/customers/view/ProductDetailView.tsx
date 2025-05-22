'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { IProducts } from '../../adminComponents/menu/menuTypes/menuTypes'

interface ProductDetailProps extends IProducts {
  onCancel: () => void;
  slug: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  id,
  name,
  description,
  price,
  image_url,
  detail,
  is_available,
  categoryId,
  slug,
  onCancel,
}) => {
  const router = useRouter()
  const [imgError, setImgError] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    if (!id) {
      toast.error('Product ID missing, cannot add to cart')
      return
    }

    const storedCart = localStorage.getItem('cart')
    const cart: (IProducts & { quantity: number })[] = storedCart ? JSON.parse(storedCart) : []

    const productIndex = cart.findIndex(item => item.id === id)

    if (productIndex !== -1) {
      cart[productIndex].quantity += quantity
      toast.success(`Quantity updated: ${cart[productIndex].quantity}`)
    } else {
      cart.push({
        id,
        name,
        description,
        price,
        image_url,
        detail,
        is_available,
        categoryId,
        quantity,
      })
      toast.success('Product added to cart')
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    router.push(`/menu/${slug}/cart`)
  }

  return (
    <div className="relative w-full max-w-md bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="relative w-full h-80">
        <img
          src={imgError ? '/placeholder.jpg' : image_url}
          alt={name}
          onError={() => setImgError(true)}
          className={`w-full h-full object-cover transition duration-300 ${
            !is_available ? 'grayscale opacity-50' : ''
          }`}
        />
        {!is_available && (
          <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
            <span className="text-black text-xl font-bold">Not available at the moment</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        <h2 className="font-bold text-lg">{name}</h2>
        <p>{description}</p>

        <p className="block text-gray-700 font-semibold mb-2 mt-6">Price</p>
        <span>${price}</span>

        <p className="block text-gray-700 font-semibold mb-2 mt-6">Available</p>
        <span>{is_available ? 'Yes' : 'No'}</span>

        <div className="mt-4">
          <label htmlFor="quantity" className="block text-gray-700 font-semibold mb-2">
            Quantity
          </label>
          {/* Aquí reemplazamos el input por los botones redondos */}
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className={`w-6 h-6 flex items-center justify-center rounded-full text-white ${
                quantity <= 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gray-400 hover:bg-gray-700'
              }`}
            >
              -
            </button>

            <span className="p-1 select-none">{quantity}</span>

            <button
              onClick={increaseQuantity}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-400 text-white hover:bg-gray-700"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-default-800 border-default-800 border-2 rounded hover:bg-default-600 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!is_available}
            className={`px-4 py-2 rounded transition cursor-pointer ${
              is_available
                ? 'bg-default-800 text-white hover:bg-default-700'
                : 'bg-gray-400 text-gray-700 cursor-not-allowed'
            }`}
          >
            Add to order
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
