import Hero from "@/components/subscribers/landingPage/heroComponent/Hero";
import Body from "@/components/subscribers/landingPage/body/Body";
import RestaurantBanner from "@/components/subscribers/landingPage/banner/RestaurantBanner";
import Footer from "@/components/subscribers/footer/Footer";
import Navbar from "@/components/subscribers/navbar/Navbar";
import AuthLinks from "@/components/auth0/AuthLinks";

export default function Page() {
    return (
        <div>
            <Navbar/>
            <Hero />
            <Body />
            <RestaurantBanner />
            <Footer/>
        </div>
    );
}
