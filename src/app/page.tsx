import Hero from "@/components/adminComponents/landingPage/heroComponent/Hero";
import Body from "@/components/adminComponents/landingPage/body/Body";
import RestaurantBanner from "@/components/adminComponents/landingPage/banner/RestaurantBanner";

export default function Page() {
    return (
        <div>
            <Hero />
            <Body />
            <RestaurantBanner />
        </div>
    );
}
