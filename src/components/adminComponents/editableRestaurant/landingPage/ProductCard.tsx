type Props = {
  name: string;
  price: string;
  image: string;
  category: string;
  popular?: boolean;
};

export default function ProductCard({ name, price, image, popular }: Props) {
  return (
    <div className="card-dark flex justify-between items-center w-full">
      <div className="flex flex-col space-y-1">
        <span className="font-semibold">{name}</span>
        <span className="text-sm text-muted">
          From {price}
          {popular && <span className="ml-2 tag-popular">★ Popular</span>}
        </span>
      </div>
      <img src={image} alt={name} className="w-24 h-24 object-cover rounded" />
    </div>
  );
}
