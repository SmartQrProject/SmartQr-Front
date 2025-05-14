import Image from "next/image";
import { Monitor, LineChart, Smartphone, Clock, DollarSign, SmileIcon } from "lucide-react";

export default function RestaurantFeatures() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                <div className="md:w-1/2">
                    <h2 className="text-2xl font-bold mb-6">Powerful Features for Modern Restaurants</h2>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0">
                                <Monitor className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-medium">Digital Menu Management</h3>
                                <p className="text-sm text-gray-600">Easily update your menu items, prices, and descriptions in real-time across all channels.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0">
                                <LineChart className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-medium">Analytics Dashboard</h3>
                                <p className="text-sm text-gray-600">Get insights into your sales, popular items, and customer preferences.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0">
                                <Smartphone className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-medium">Mobile Ordering</h3>
                                <p className="text-sm text-gray-600">Allow customers to browse and place orders from their smartphones for dine-in, pickup, or delivery.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:w-1/2 flex justify-center md:justify-end">
                    <Image unoptimized src="/imagenes/qr.jpg" alt="Digital menu management on tablet" width={400} height={300} className="rounded-md object-cover" />
                </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8">
                <div className="md:w-1/2 flex justify-center md:justify-start">
                    <Image unoptimized src="/imagenes/home-section.jpg" alt="Chef working in restaurant" width={400} height={300} className="rounded-md object-cover" />
                </div>

                <div className="md:w-1/2">
                    <h2 className="text-2xl font-bold mb-6">Transform Your Restaurant Operations</h2>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0">
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    <Clock className="w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium">Save Time</h3>
                                <p className="text-sm text-gray-600">Automate ordering processes to free up time for what matters most.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0">
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    <DollarSign className="w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium">Increased Revenue</h3>
                                <p className="text-sm text-gray-600">Boost sales with upselling features and digital marketing capabilities.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0">
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    <SmileIcon className="w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium">Happy Customers</h3>
                                <p className="text-sm text-gray-600">Enhance guest experience with faster service and accurate order fulfillment.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
