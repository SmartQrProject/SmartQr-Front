import CardView from "../adminComponents/menu/card/CardView";

interface Product {
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
}

export default function PublicCategoryList({ categories }: Props) {
  const visibleCategories = categories.filter(
    (cat) => cat.products && cat.products.length > 0
  );

  return (
    <section className="px-4 py-8">
      {visibleCategories.map((cat) => (
        <div key={cat.name} id={cat.name} className="mb-16">
          <div className=" mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-default-800">
              {cat.name}
            </h3>

            <div className="flex flex-wrap justify-start gap-6">
              {cat.products.map((product) => (
                <div
                  key={product.name}
                  className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2"
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
          </div>
        </div>
      ))}
    </section>
  );
}
