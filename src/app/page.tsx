import Hero from "@/components/adminComponents/landingPage/heroComponent/Hero";
import Body from "@/components/adminComponents/landingPage/body/Body";
import RestaurantBanner from "@/components/adminComponents/landingPage/banner/RestaurantBanner";
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
