import { useState } from "react";
import CardView from "../adminComponents/menu/card/CardView";
import { IProducts } from "../adminComponents/menu/menuTypes/menuTypes";
import ProductDetail from "../customers/view/ProductDetailView";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  details?: string[];
  is_available?: boolean;
}

interface Category {
  id?: string;
  name: string;
  products: Product[];
}

interface Props {
  categories: Category[];
  slug: string;
}

export default function PublicCategoryList({ categories, slug }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<IProducts | null>(null);

  const visibleCategories = categories.filter(
    (cat) => cat.products && cat.products.length > 0
  );

  return (
    <section className="px-4 py-8">
      {visibleCategories.map((cat) => (
        <div key={cat.name} id={cat.name} className="mb-16">
          <h3 className="text-2xl font-bold mb-6 text-default-800">{cat.name}</h3>

          <div className="flex flex-wrap justify-start gap-6">
            {cat.products.map((product) => (
              <div
                key={product.id}
                className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                onClick={() =>
                  setSelectedProduct({
                    id: product.id,
                    categoryId: cat.id ?? '',
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image_url: product.image_url || '',
                    detail: product.details,
                    is_available: product.is_available,
                  })
                }
              >
                <CardView
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  file={product.image_url || ""}
                  details={product.details || []}
                  is_available={product.is_available ?? true}
                  categoryId={cat.id ?? ""}
                />
              </div>
            ))}
          </div>

          {selectedProduct && (
            <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center px-4">
              <ProductDetail
                {...selectedProduct}
                slug={slug}
                onCancel={() => setSelectedProduct(null)}
              />
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
