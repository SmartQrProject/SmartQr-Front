import React from "react";
import AboutUs from "./../../components/aboutUs/AboutUs";
import Navbar from "@/components/subscribers/navbar/Navbar";
import Footer from "@/components/subscribers/footer/Footer";

const Page = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
                <AboutUs />
            </main>

            <Footer />
        </div>
    );
};

export default Page;
