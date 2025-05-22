'use client'

import { useState, useEffect } from 'react'
import { IProducts } from '../menuTypes/menuTypes'
import { getProducts } from '../menuHelpers/fetch/products'

const ListProducts = () => {
  const [products, setProducts] = useState<IProducts[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const storedData = localStorage.getItem('adminSession')
      if (!storedData) return setError('Token not found')

      const { token, payload } = JSON.parse(storedData)
      const slug = payload?.slug
      if (!slug) return setError('Slug not found')

      try {
        const data = await getProducts(slug, token)
        setProducts(data.products || [])
      } catch (err: any) {
        setError(err.message || 'Error fetching products')
      }
    }

    fetchData()
  }, [])

  return (
    <div className="relative">
      <div className="space-y-4 w-full max-w-md p-6 rounded-md bg-neutral-100 shadow mx-auto mb-8">
        <h2 className="text-xl font-semibold text-center border-b border-gray-100 pb-2">
          Available Products
        </h2>

        {error && <p className="text-red-500">{error}</p>}

        {products.length > 0 ? (
          <ul className="space-y-3">
            {products.map((product) => (
              <li key={product.id} className="bg-white rounded-xl shadow flex items-center justify-between px-3 py-2">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.description}</p>
                  <p className="text-sm font-bold">${product.price}</p>
                  {product.detail && (
                    <p className="text-sm text-gray-400">{product.detail}</p>
                  )}
                </div>
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center font-medium">No products found</p>
        )}
      </div>
    </div>
  )
}

export default ListProducts
