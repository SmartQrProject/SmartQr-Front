import Link from "next/link";
import Image from "next/image";

export default function Hero() {
    return (
        <div className="bg-[#4285F4] min-h-[500px] w-full relative overflow-hidden py-16">
            <div className="absolute top-0 left-0">
                <Image src="/imagenes/coffe.png" alt="Coffee beans" width={200} height={200} className="object-contain" priority />
            </div>

            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 z-10 mb-10 md:mb-0">
                    <h1 className="text-black text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        Streamline Your
                        <br />
                        Restaurant
                        <br />
                        Operations
                    </h1>
                    <p className="text-black mb-8 max-w-md">
                        Empower your restaurant with our self-ordering system. Increase efficiency, reduce errors, and delight your customers.
                    </p>
                    <Link href="/signup" className="bg-white text-[#4285F4] px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all inline-block">
                        Create Account
                    </Link>
                </div>

                <div className="md:w-1/2 relative flex justify-center">
                    <div className="relative">
                        <Image src="/imagenes/bagel.png" alt="Delicious bagel sandwich" width={300} height={300} className="object-contain z-10 relative" priority />
                        <div className="absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/4">
                            <div className="bg-white w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                                <div className="w-20 h-20 md:w-28 md:h-28 grid grid-cols-4 grid-rows-4 gap-1">
                                    {[...Array(16)].map((_, i) => (
                                        <div key={i} className={`col-span-1 row-span-1 ${[0, 1, 2, 4, 7, 9, 11, 12, 14].includes(i) ? "bg-[#4285F4]" : "bg-white"}`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
