import Image from "next/image";
import {  Monitor, LineChart, Smartphone, Clock, DollarSign, SmileIcon} from "lucide-react";

export default function RestaurantFeatures() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      
        <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Powerful Features for Modern Restaurants
                </h2>
                <ul className="space-y-6">
                    <FeatureItem
                    icon={<Monitor className="w-6 h-6 text-blue-600" />}
                    title="Digital Menu Management"
                    description="Easily update your menu items, prices, and descriptions in real-time across all channels."
                    />
                    <FeatureItem
                    icon={<LineChart className="w-6 h-6 text-blue-600" />}
                    title="Analytics Dashboard"
                    description="Get insights into your sales, popular items, and customer preferences."
                    />
                    <FeatureItem
                    icon={<Smartphone className="w-6 h-6 text-blue-600" />}
                    title="Mobile Ordering"
                    description="Allow customers to browse and place orders from their smartphones for dine-in, pickup, or delivery."
                    />
                </ul>
            </div>

            <div className="w-full md:w-1/2">
            <Image
                unoptimized
                src={`https://res.cloudinary.com/${cloudName}/image/upload/ikyrxzhyg0velpokdqr3.jpg`}
                alt="Digital menu management on tablet"
                width={600}
                height={400}
                className="rounded-xl object-cover w-full h-auto shadow-lg"
            />
            </div>
        </div>

        
        <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
                <Image
                    unoptimized
                    src={`https://res.cloudinary.com/${cloudName}/image/upload/jzpr9opcabbjjbbbgxfm.jpg`}
                    alt="Staff member giving an order"
                    width={600}
                    height={400}
                    className="rounded-xl object-cover w-full h-auto shadow-lg"
                />
            </div>

            <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Transform Your Restaurant Operations
                </h2>
                <ul className="space-y-6">
                    <FeatureItem
                    icon={
                        <CircleIcon>
                        <Clock className="w-4 h-4" />
                        </CircleIcon>
                    }
                    title="Save Time"
                    description="Automate ordering processes to free up time for what matters most."
                    />
                    <FeatureItem
                    icon={
                        <CircleIcon>
                        <DollarSign className="w-4 h-4" />
                        </CircleIcon>
                    }
                    title="Increased Revenue"
                    description="Boost sales with upselling features and digital marketing capabilities."
                    />
                    <FeatureItem
                    icon={
                        <CircleIcon>
                        <SmileIcon className="w-4 h-4" />
                        </CircleIcon>
                    }
                    title="Happy Customers"
                    description="Enhance guest experience with faster service and accurate order fulfillment."
                    />
                </ul>
            </div>
        </div>
    </section>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <li className="flex items-start gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm md:text-base">{description}</p>
      </div>
    </li>
  );
}

function CircleIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
      {children}
    </div>
  );
}
