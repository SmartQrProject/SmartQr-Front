import Link from "next/link";

export default function RestaurantBanner() {
    return (
        <div className="w-full bg-blue-500 py-12 px-4 text-center text-white rounded-md">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Ready to Modernize Your Restaurant?</h2>
                <p className="mb-8 text-lg">Join thousands of restaurants already using our platform to streamline their operations and delight their customers.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/create-account" className="bg-white text-blue-500 hover:bg-blue-50 transition-colors px-6 py-3 rounded-full font-medium">
                        Create Account
                    </Link>
                    <Link href="/schedule-demo" className="border border-white text-white hover:bg-blue-600 transition-colors px-6 py-3 rounded-full font-medium">
                        Schedule Demo
                    </Link>
                </div>
            </div>
        </div>
    );
}
