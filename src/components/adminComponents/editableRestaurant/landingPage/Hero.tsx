interface HeroProps {
  name: string;
}

export default function Hero({ name }: HeroProps) {
  return (
    <div className="relative w-full h-64 md:h-150 bg-cover bg-center flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50"></div>
      <h2 className="relative text-white text-4xl md:text-5xl font-bold z-10">
       {name}
      </h2>
    </div>
  );
}
