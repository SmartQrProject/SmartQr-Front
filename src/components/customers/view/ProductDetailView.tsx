'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { IProducts } from '../../adminComponents/menu/menuTypes/menuTypes'
import { MinusCircle, PlusCircle } from 'lucide-react'
import { CgClose } from 'react-icons/cg'

interface ProductDetailProps extends IProducts {
  onCancel: () => void
  slug: string
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

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    if (!id) {
      toast.error('Product ID missing, cannot add to cart')
      return
    }

    const storedCart = localStorage.getItem('cart')
    const cart: (IProducts & { quantity: number })[] = storedCart ? JSON.parse(storedCart) : []

    const productIndex = cart.findIndex((item) => item.id === id)

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
    onCancel()
    
  }

  return (
    <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg scrollbar-hide">

      <button
        onClick={onCancel}
        className="absolute top-4 right-4 z-10 w-8 h-8 border border-gray-300 rounded-full text-gray-600 hover:text-black flex items-center justify-center bg-white shadow cursor-pointer"
      >
       <CgClose className="h-5 w-5" />
      </button>

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
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-black text-xl font-bold">Not available at the moment</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        <h2 className="font-bold text-lg">{name}</h2>
        <p>{description}</p>

        <p className="block text-gray-700 font-semibold mt-4">Price</p>
        <span>${Number(price).toFixed(2)}</span>

        <p className="block text-gray-700 font-semibold mt-4">Available</p>
        <span>{is_available ? 'Yes' : 'No'}</span>

        <div className="mt-4">
          <label htmlFor="quantity" className="block text-gray-700 font-semibold mb-2">
            Quantity
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="disabled:cursor-not-allowed cursor-pointer"
            >
              <MinusCircle className="h-6 w-6 text-blue-500 hover:text-blue-400" />
            </button>
            <span className="w-6 text-center">{quantity}</span>
            <button onClick={increaseQuantity}>
              <PlusCircle className="h-6 w-6 text-blue-500 hover:text-blue-400 cursor-pointer" />
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-default-800 border-default-800 border-2 rounded hover:bg-default-600 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!is_available}
            className={`px-4 py-2 rounded transition ${
              is_available
                ? 'bg-default-800 text-white hover:bg-default-700 cursor-pointer'
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
