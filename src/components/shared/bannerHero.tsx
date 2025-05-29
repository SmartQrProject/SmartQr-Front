
interface BannerHeroProps {
  imageUrl?: string;
  title: string;
}

export default function BannerHero({ imageUrl, title }: BannerHeroProps) {
  return (
    <div className="relative w-full h-[33vh] sm:h-[40vh] md:h-[50vh] bg-gray-100 overflow-hidden">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Banner"
          className="w-full h-full object-cover absolute inset-0"
        />
      )}

      <div className="absolute inset-0 bg-black/50 z-10" />

      <h1 className="absolute z-10 inset-0 flex items-center justify-center text-white text-3xl md:text-5xl font-bold pointer-events-none">
        {title}
      </h1>
    </div>
  );
}
