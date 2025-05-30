
import BillingComponent from "@/components/adminComponents/billing/Billing";
import FooterAdmin from "@/components/adminComponents/footer/Footer";
import MenuAdmin from "@/components/adminComponents/menudesplegabe/MenuAdmin";
import NavbarAdmin from "@/components/adminComponents/navbar/NavbarAdmin";


export default function BillingPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavbarAdmin />
            <div className="flex flex-1">
                <MenuAdmin />
                <main className="flex-1 p-4">
                    <BillingComponent/>
                </main>
            </div>
            <FooterAdmin />
        </div>
    );
}